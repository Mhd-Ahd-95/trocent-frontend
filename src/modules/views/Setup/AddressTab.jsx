import React from 'react'
import { DrawerForm, Table } from '../../components'
import { Grid, Typography, Chip } from '@mui/material'
import { AccessTime, CheckCircleOutline, HighlightOffOutlined } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useAddressBookByTerminals, useAddressBookMutations } from '../../hooks/useAddressBooks'
import AddressBookForm from '../AddressBook/AddressBookForm'

function AddressTab({ enabled }) {

    const { enqueueSnackbar } = useSnackbar()
    const [addressBook, setAddressBook] = React.useState({})
    const [openDrawer, setOpenDrawer] = React.useState(false)

    const { data = [], isLoading, isError, error, isFetching } = useAddressBookByTerminals({ enabled })
    const { create, update } = useAddressBookMutations()

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight={700}>Default Address Book By Terminals</Typography>
            </Grid>
            <Grid size={12}>
                <Table
                    pageSizeOptions={[10, 25, 50]}
                    pageSize={10}
                    getRowId={(row) => row.id ?? row.terminal}
                    loading={isLoading || isFetching}
                    field='terminal'
                    options={{ filtering: true, search: true, columns: true }}
                    onRowClick={params => { setAddressBook(params.row); setOpenDrawer(2) }}
                    columns={[
                        {
                            headerName: 'Terminal',
                            field: 'terminal',
                            minWidth: 120,
                            flex: 1,
                            renderCell: rowData => (
                                <Chip
                                    label={rowData.value ?? 'No Terminal'}
                                    sx={{ fontWeight: 700 }}
                                    color={rowData.value ? 'primary' : 'default'}
                                    variant={'outlined'}
                                />
                            ),
                            sortable: true
                        },
                        {
                            headerName: 'Company/Location',
                            field: 'name',
                            minWidth: 170,
                            flex: 1,
                            renderCell: rowData => <strong style={{ fontWeight: 600 }}>{rowData.value}</strong>,
                            sortable: true
                        },
                        {
                            headerName: 'Contact',
                            field: 'contact_name',
                            minWidth: 100,
                            flex: 1
                        },
                        {
                            headerName: 'Address',
                            field: 'address',
                            minWidth: 240,
                            flex: 1
                        },
                        {
                            headerName: 'City',
                            field: 'city',
                            minWidth: 130,
                            flex: 1
                        },
                        {
                            headerName: 'Province',
                            field: 'province',
                            minWidth: 50,
                            flex: 1
                        },
                        {
                            headerName: 'Phone',
                            field: 'phone_number',
                            minWidth: 120,
                            flex: 1
                        },
                        {
                            headerName: 'Appt',
                            field: 'requires_appointment',
                            minWidth: 100,
                            flex: 1,
                            renderCell: rowData => rowData.value ? <AccessTime sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='primary' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action' />
                        },
                        {
                            headerName: 'No Wait',
                            field: 'no_waiting_time',
                            minWidth: 100,
                            flex: 1,
                            renderCell: rowData => rowData.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action' />
                        },
                    ]}
                    data={[...(data || [])].sort((a, b) => (a.terminal ?? '').localeCompare(b.terminal ?? ''))}
                />
            </Grid>
            {openDrawer === 2 &&
                <DrawerForm title={<span>Default Address for <strong style={{ color: '#DD9100' }}>{addressBook?.terminal}</strong></span>} setOpen={setOpenDrawer} open={openDrawer === 2}>
                    <AddressBookForm
                        initialValues={{ ...addressBook }}
                        submit={async (payload) => {
                            if (addressBook.id) {
                                await update.mutateAsync({ id: addressBook.id, payload })
                            }
                            else {
                                await create.mutateAsync(payload)
                            }
                        }}
                        editMode
                        setOpen={setOpenDrawer}
                    />
                </DrawerForm>
            }
        </Grid>
    )
}

export default React.memo(AddressTab)