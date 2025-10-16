import React from "react";
import { Table } from '../'
import { CheckCircleOutline, Close } from "@mui/icons-material";
import moment from "moment";


export default function RateSheetCustomerTable(props) {

    const { setOpenModal } = props

    return (
        <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            // loading={isLoading}
            title='Rate Sheets'
            options={{
                filtering: false,
                search: false
            }}
            importedButton='true'
            handleImportedButton={() => setOpenModal(true)}
            columns={[
                {
                    headerName: 'Type',
                    field: 'type',
                    minWidth: 250,
                    flex: 1
                },
                {
                    headerName: 'Skid → Weight',
                    field: 'skid_by_weight',
                    minWidth: 110,
                    flex: 1,
                    renderCell: params => params.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <Close sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='error' />
                },
                {
                    headerName: 'Imported On',
                    field: 'batch_id',
                    minWidth: 150,
                    flex: 1,
                    renderCell: params => {
                        const imported_date = params.value?.split('_')[0]
                        return moment(imported_date).format('MMM DD, YYYY hh:mm:ss')
                    }
                },
                {
                    field: 'actions',
                    headerName: 'Actions',
                    sortable: false,
                    flex: 1,
                    minWidth: 100,
                    renderCell: params => (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                marginTop: 1
                            }}
                        >
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                variant='text'
                                size='small'
                                sx={{
                                    textTransform: 'capitalize',
                                    '& .MuiButton-startIcon': { marginRight: 0.5 },
                                    fontSize: '0.8rem',
                                    minWidth: 'unset',
                                    p: 0.5
                                }}
                                color='error'
                            >
                                Delete
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                variant='text'
                                size='small'
                                sx={{
                                    textTransform: 'capitalize',
                                    '& .MuiButton-startIcon': { marginRight: 0.5 },
                                    fontSize: '0.8rem',
                                    minWidth: 'unset',
                                    p: 0.5
                                }}
                            >
                                View
                            </Button>
                        </Box>
                    )
                }
            ]}
            data={[]}
        />
    )

}