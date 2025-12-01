import React from 'react'
import {
  Grid,
  Autocomplete,
  Switch,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material'
import { CancelOutlined, Delete, Sync } from '@mui/icons-material'
import { styled, useTheme } from '@mui/material/styles'
import { Controller } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import OrderEngine from './OrderEngine'

const FreightRowStyled = styled(Grid)(({ theme, index }) => ({
  padding: theme.spacing(2),
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;',
  marginTop: index === 0 ? 0 : theme.spacing(3)
}))

const FreightRow = ({ fields, index, control, calculationRef, remove, setValue, getValues }) => {
  const theme = useTheme()
  const item = fields[index]

  const [localValues, setLocalValues] = React.useState({})
  const updateTimeoutRef = React.useRef(null)

  const getCurrentValue = React.useCallback((fieldName) => {
    if (fieldName in localValues) {
      return localValues[fieldName]
    }
    return getValues(`freights.${index}.${fieldName}`)
  }, [localValues, getValues, index])

  const handleFieldChange = React.useCallback((fieldName, value) => {
    setLocalValues(prev => ({ ...prev, [fieldName]: value }))
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    updateTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setValue(`freights.${index}.${fieldName}`, value, { shouldValidate: false, shouldDirty: true })
        if (['pieces', 'length', 'width', 'height', 'dim_unit', 'not_stack'].includes(fieldName)) {
          const freight = {
            pieces: Number(getCurrentValue('pieces')) || 1,
            length: Number(getCurrentValue('length')) || 0,
            width: Number(getCurrentValue('width')) || 0,
            height: Number(getCurrentValue('height')) || 0,
            dim_unit: getCurrentValue('dim_unit') || 'in',
            unit: getCurrentValue('unit') || 'lbs',
            not_stack: getCurrentValue('not_stack') || false,
            [fieldName]: ['dim_unit', 'unit', 'type'].includes(fieldName)
              ? value
              : fieldName === 'not_stack'
                ? value
                : Number(value) || 0
          }
          const volumeWeight = OrderEngine.calculateVolumeWeight(freight)
          setValue(`freights.${index}.volume_weight`, volumeWeight, { shouldValidate: false, shouldDirty: false })
          setLocalValues(prev => ({ ...prev, volume_weight: volumeWeight }))
        }
      })
    }, 150)
  }, [index, setValue, getCurrentValue])

  React.useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const handleRemove = React.useCallback(() => remove(index), [index, remove])

  // const title = React.useMemo(() => {
  //   const type = getCurrentValue('type') || 'Skid'
  //   const pieces = getCurrentValue('pieces') || 0
  //   const weight = getCurrentValue('weight') || 0
  //   const unit = (getCurrentValue('unit') || 'lbs').toLowerCase()
  //   return `${type}: ${pieces} pcs, ${weight} ${unit}`
  // }, [getCurrentValue, localValues])

  const volumeWeight = getCurrentValue('volume_weight') || 0
  const unit = getCurrentValue('unit') || 'lbs'
  const isConverted = getCurrentValue('is_converted') || false

  return (
    <FreightRowStyled container spacing={1} key={item.id} index={index || 0}>
      {/* Type */}
      <Grid size={12}>
        <Grid container justifyContent={'flex-end'} position={'relative'}>
          <Grid size='auto' position={'absolute'} right={-33.5} top={-33.5}>
            <Tooltip title='Delete'>
              <span>
                <IconButton
                  size='small'
                  disabled={fields?.length < 2}
                  color='error'
                  onClick={e => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                >
                  <CancelOutlined />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 1.4 }}>
        <Controller
          name={`freights.${index}.type`}
          control={control}
          rules={{ required: 'Type is required' }}
          render={({ field, fieldState }) => (
            <Autocomplete
              value={getCurrentValue('type') || ''}
              options={['Skid', 'Box', 'Envelope']}
              onChange={(_, value) => {
                field.onChange(value)
                handleFieldChange('type', value)
                calculationRef?.current?.recalculate()
              }}
              renderInput={params => (
                <TextInput
                  {...params}
                  label='Type*'
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        />
      </Grid>

      {/* Description */}
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Controller
          name={`freights.${index}.description`}
          control={control}
          render={({ field }) => (
            <TextInput
              label='Description'
              variant='outlined'
              fullWidth
              value={getCurrentValue('description') || ''}
              onChange={(e) => {
                field.onChange(e.target.value)
                handleFieldChange('description', e.target.value)
              }}
            />
          )}
        />
      </Grid>

      {/* Pieces */}
      <Grid size={{ xs: 12, sm: 6, md: 1.3 }}>
        <Controller
          name={`freights.${index}.pieces`}
          control={control}
          render={({ field }) => (
            <TextInput
              label='Pieces'
              variant='outlined'
              type='number'
              fullWidth
              value={getCurrentValue('pieces') || ''}
              onChange={(e) => {
                field.onChange(Number(e.target.value))
                handleFieldChange('pieces', Number(e.target.value))
                calculationRef?.current?.recalculate()
              }}
            />
          )}
        />
      </Grid>

      {/* Weight */}
      <Grid size={{ xs: 12, sm: 6, md: 1.3 }}>
        <Controller
          name={`freights.${index}.weight`}
          control={control}
          render={({ field }) => (
            <TextInput
              label='Weight'
              variant='outlined'
              type='number'
              fullWidth
              value={getCurrentValue('weight') || ''}
              onChange={(e) => {
                field.onChange(Number(e.target.value))
                handleFieldChange('weight', Number(e.target.value))
                calculationRef?.current?.recalculate()
              }}
              helperText={volumeWeight ? `vol: ${Math.round(volumeWeight * 100) / 100} ${unit}` : `Vol: 0.00 ${unit}`}
            />
          )}
        />
      </Grid>

      {/* Unit with conversion */}
      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
        <Controller
          name={`freights.${index}.unit`}
          control={control}
          render={({ field }) => (
            <TextInput
              select
              label='Unit'
              variant='outlined'
              fullWidth
              value={getCurrentValue('unit') || 'lbs'}
              onChange={(e) => {
                const value = e.target.value
                field.onChange(value)
                handleFieldChange('unit', value)
                if (value === 'lbs') {
                  setValue(`freights.${index}.dim_unit`, 'in')
                  handleFieldChange('dim_unit', 'in')
                } else {
                  setValue(`freights.${index}.dim_unit`, 'cm')
                  handleFieldChange('dim_unit', 'cm')
                }
                calculationRef?.current?.recalculate()
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => {
                          const newValue = !isConverted
                          setValue(`freights.${index}.is_converted`, newValue)
                          handleFieldChange('is_converted', newValue)
                          calculationRef?.current?.recalculate()
                        }}
                        color={isConverted ? 'success' : 'default'}
                      >
                        <Sync />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              helperText={isConverted ? 'Conv.: ON' : 'Conv.: OFF'}
              sx={{
                position: 'relative',
                '& button': {
                  borderLeft: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: 0,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  height: '100%',
                  '& svg': { fontSize: 18, marginTop: 0.3 }
                },
                '& .MuiSelect-icon': {
                  position: 'absolute',
                  top: 14,
                  right: 35,
                  fontSize: 20
                }
              }}
            >
              <MenuItem value='lbs'>LBS</MenuItem>
              <MenuItem value='kg'>KG</MenuItem>
            </TextInput>
          )}
        />
      </Grid>

      {/* Length */}
      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
        <Controller
          name={`freights.${index}.length`}
          control={control}
          render={({ field }) => (
            <TextInput
              label='Length'
              variant='outlined'
              type='number'
              fullWidth
              value={getCurrentValue('length') || ''}
              onChange={(e) => {
                field.onChange(Number(e.target.value))
                handleFieldChange('length', Number(e.target.value))
                calculationRef?.current?.recalculate()
              }}
            />
          )}
        />
      </Grid>

      {/* Width */}
      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
        <Controller
          name={`freights.${index}.width`}
          control={control}
          render={({ field }) => (
            <TextInput
              label='Width'
              variant='outlined'
              type='number'
              fullWidth
              value={getCurrentValue('width') || ''}
              onChange={(e) => {
                field.onChange(Number(e.target.value))
                handleFieldChange('width', Number(e.target.value))
                calculationRef?.current?.recalculate()
              }}
            />
          )}
        />
      </Grid>

      {/* Height */}
      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
        <Controller
          name={`freights.${index}.height`}
          control={control}
          render={({ field }) => (
            <TextInput
              label='Height'
              variant='outlined'
              type='number'
              fullWidth
              value={getCurrentValue('height') || ''}
              onChange={(e) => {
                field.onChange(Number(e.target.value))
                handleFieldChange('height', Number(e.target.value))
                calculationRef?.current?.recalculate()
              }}
            />
          )}
        />
      </Grid>

      {/* Dim Unit */}
      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
        <Controller
          name={`freights.${index}.dim_unit`}
          control={control}
          render={({ field }) => (
            <TextInput
              select
              label='Dim Unit'
              variant='outlined'
              fullWidth
              value={getCurrentValue('dim_unit') || 'in'}
              onChange={(e) => {
                const value = e.target.value
                field.onChange(value)
                handleFieldChange('dim_unit', value)
                if (value === 'in') {
                  setValue(`freights.${index}.unit`, 'lbs')
                  handleFieldChange('unit', 'lbs')
                } else {
                  setValue(`freights.${index}.unit`, 'kg')
                  handleFieldChange('unit', 'kg')
                }
                calculationRef?.current?.recalculate()
              }}
            >
              <MenuItem value='in'>IN</MenuItem>
              <MenuItem value='cm'>CM</MenuItem>
            </TextInput>
          )}
        />
      </Grid>

      {/* Not Stack */}
      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
        <Controller
          name={`freights.${index}.not_stack`}
          control={control}
          render={({ field }) => (
            <CustomFormControlLabel
              control={
                <Switch
                  checked={getCurrentValue('not_stack') || false}
                  onChange={(e) => {
                    const checked = e.target.checked
                    field.onChange(checked)
                    handleFieldChange('not_stack', checked)
                    calculationRef?.current?.recalculate()
                  }}
                />
              }
              label='Not Stack'
              sx={{ '& span': { fontSize: 12, whiteSpace: 'nowrap' } }}
            />
          )}
        />
      </Grid>
    </FreightRowStyled>

    // <AccordionComponent
    //   fieldsLength={fields.length}
    //   handleDelete={handleRemove}
    //   key={item.id}
    //   title={title}
    //   content={
    //     <Grid container spacing={1}>
    //       {/* Type */}
    //       <Grid size={{ xs: 12, sm: 6, md: 2 }}>
    //         <Controller
    //           name={`freights.${index}.type`}
    //           control={control}
    //           rules={{ required: 'Type is required' }}
    //           render={({ field, fieldState }) => (
    //             <Autocomplete
    //               value={getCurrentValue('type') || ''}
    //               options={['Skid', 'Box', 'Envelope']}
    //               onChange={(_, value) => {
    //                 field.onChange(value)
    //                 handleFieldChange('type', value)
    //                 calculationRef?.current?.recalculate()
    //               }}
    //               renderInput={params => (
    //                 <TextInput
    //                   {...params}
    //                   label='Type*'
    //                   fullWidth
    //                   error={!!fieldState.error}
    //                   helperText={fieldState.error?.message}
    //                 />
    //               )}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Description */}
    //       <Grid size={{ xs: 12, sm: 6, md: 2 }}>
    //         <Controller
    //           name={`freights.${index}.description`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               label='Description'
    //               variant='outlined'
    //               fullWidth
    //               value={getCurrentValue('description') || ''}
    //               onChange={(e) => {
    //                 field.onChange(e.target.value)
    //                 handleFieldChange('description', e.target.value)
    //               }}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Pieces */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.pieces`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               label='Pieces'
    //               variant='outlined'
    //               type='number'
    //               fullWidth
    //               value={getCurrentValue('pieces') || ''}
    //               onChange={(e) => {
    //                 field.onChange(e.target.value)
    //                 handleFieldChange('pieces', e.target.value)
    //                 calculationRef?.current?.recalculate()
    //               }}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Weight */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.weight`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               label='Weight'
    //               variant='outlined'
    //               type='number'
    //               fullWidth
    //               value={getCurrentValue('weight') || ''}
    //               onChange={(e) => {
    //                 field.onChange(e.target.value)
    //                 handleFieldChange('weight', e.target.value)
    //                 calculationRef?.current?.recalculate()
    //               }}
    //               helperText={volumeWeight ? `vol: ${Math.round(volumeWeight * 100) / 100} ${unit}` : `Vol: 0.00 ${unit}`}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Unit with conversion */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.unit`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               select
    //               label='Unit'
    //               variant='outlined'
    //               fullWidth
    //               value={getCurrentValue('unit') || 'lbs'}
    //               onChange={(e) => {
    //                 const value = e.target.value
    //                 field.onChange(value)
    //                 handleFieldChange('unit', value)
    //                 if (value === 'lbs') {
    //                   setValue(`freights.${index}.dim_unit`, 'in')
    //                   handleFieldChange('dim_unit', 'in')
    //                 } else {
    //                   setValue(`freights.${index}.dim_unit`, 'cm')
    //                   handleFieldChange('dim_unit', 'cm')
    //                 }
    //                 calculationRef?.current?.recalculate()
    //               }}
    //               slotProps={{
    //                 input: {
    //                   endAdornment: (
    //                     <InputAdornment position='end'>
    //                       <IconButton
    //                         onClick={() => {
    //                           const newValue = !isConverted
    //                           setValue(`freights.${index}.is_converted`, newValue)
    //                           handleFieldChange('is_converted', newValue)
    //                           calculationRef?.current?.recalculate()
    //                         }}
    //                         color={isConverted ? 'success' : 'default'}
    //                       >
    //                         <Sync />
    //                       </IconButton>
    //                     </InputAdornment>
    //                   )
    //                 }
    //               }}
    //               helperText={isConverted ? 'Conv.: ON' : 'Conv.: OFF'}
    //               sx={{
    //                 position: 'relative',
    //                 '& button': {
    //                   borderLeft: `1px solid ${theme.palette.grey[200]}`,
    //                   borderRadius: 0,
    //                   position: 'absolute',
    //                   top: 0,
    //                   right: 0,
    //                   height: '100%',
    //                   '& svg': { fontSize: 18, marginTop: 0.3 }
    //                 },
    //                 '& .MuiSelect-icon': {
    //                   position: 'absolute',
    //                   top: 14,
    //                   right: 35,
    //                   fontSize: 20
    //                 }
    //               }}
    //             >
    //               <MenuItem value='lbs'>LBS</MenuItem>
    //               <MenuItem value='kg'>KG</MenuItem>
    //             </TextInput>
    //           )}
    //         />
    //       </Grid>

    //       {/* Length */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.length`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               label='Length'
    //               variant='outlined'
    //               type='number'
    //               fullWidth
    //               value={getCurrentValue('length') || ''}
    //               onChange={(e) => {
    //                 field.onChange(e.target.value)
    //                 handleFieldChange('length', e.target.value)
    //                 calculationRef?.current?.recalculate()
    //               }}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Width */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.width`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               label='Width'
    //               variant='outlined'
    //               type='number'
    //               fullWidth
    //               value={getCurrentValue('width') || ''}
    //               onChange={(e) => {
    //                 field.onChange(e.target.value)
    //                 handleFieldChange('width', e.target.value)
    //                 calculationRef?.current?.recalculate()
    //               }}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Height */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.height`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               label='Height'
    //               variant='outlined'
    //               type='number'
    //               fullWidth
    //               value={getCurrentValue('height') || ''}
    //               onChange={(e) => {
    //                 field.onChange(e.target.value)
    //                 handleFieldChange('height', e.target.value)
    //                 calculationRef?.current?.recalculate()
    //               }}
    //             />
    //           )}
    //         />
    //       </Grid>

    //       {/* Dim Unit */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.dim_unit`}
    //           control={control}
    //           render={({ field }) => (
    //             <TextInput
    //               select
    //               label='Dim Unit'
    //               variant='outlined'
    //               fullWidth
    //               value={getCurrentValue('dim_unit') || 'in'}
    //               onChange={(e) => {
    //                 const value = e.target.value
    //                 field.onChange(value)
    //                 handleFieldChange('dim_unit', value)
    //                 if (value === 'in') {
    //                   setValue(`freights.${index}.unit`, 'lbs')
    //                   handleFieldChange('unit', 'lbs')
    //                 } else {
    //                   setValue(`freights.${index}.unit`, 'kg')
    //                   handleFieldChange('unit', 'kg')
    //                 }
    //                 calculationRef?.current?.recalculate()
    //               }}
    //             >
    //               <MenuItem value='in'>IN</MenuItem>
    //               <MenuItem value='cm'>CM</MenuItem>
    //             </TextInput>
    //           )}
    //         />
    //       </Grid>

    //       {/* Not Stack */}
    //       <Grid size={{ xs: 12, sm: 6, md: 1 }}>
    //         <Controller
    //           name={`freights.${index}.not_stack`}
    //           control={control}
    //           render={({ field }) => (
    //             <CustomFormControlLabel
    //               control={
    //                 <Switch
    //                   checked={getCurrentValue('not_stack') || false}
    //                   onChange={(e) => {
    //                     const checked = e.target.checked
    //                     field.onChange(checked)
    //                     handleFieldChange('not_stack', checked)
    //                     calculationRef?.current?.recalculate()
    //                   }}
    //                 />
    //               }
    //               label='Not Stack'
    //               sx={{ '& span': { fontSize: 12, whiteSpace: 'nowrap' } }}
    //             />
    //           )}
    //         />
    //       </Grid>
    //     </Grid>
    //   }
    //   icons
    // />
  )
}

// Memoize with custom comparison to prevent unnecessary re-renders
export default React.memo(FreightRow, (prevProps, nextProps) => {
  return (
    prevProps.index === nextProps.index &&
    prevProps.fields.length === nextProps.fields.length
  )
})