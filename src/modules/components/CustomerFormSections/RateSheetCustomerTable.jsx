import React from "react";
import { ConfirmModal, CustomCell, Table, Modal } from '../'
import { CheckCircleOutline, HighlightOffOutlined } from "@mui/icons-material";
import moment from "moment";
import { useRateSheetMutations, useRateSheetsCustomer } from "../../hooks/useRateSheets";
import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";

function RateSheetCustomerTable(props) {

    const { setOpenModal, customer_id } = props
    const { data, isLoading, isError, error, isRefetching } = useRateSheetsCustomer(customer_id)
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = React.useState(false)
    const selectedRef = React.useRef(null)
    const { remove } = useRateSheetMutations()

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    const handleDeleteRateSheets = (bid) => {
        remove.mutate({bid, customer_id})
        selectedRef.current = null
        setOpen(false)
    }

    return (
        <>
            <Table
                pageSizeOptions={[10, 25, 50]}
                pageSize={10}
                loading={isLoading || isRefetching}
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
                        flex: 1,
                        renderCell: params => <CustomCell>{params.value}</CustomCell>
                    },
                    {
                        headerName: 'Skid → Weight',
                        field: 'skid_by_weight',
                        minWidth: 110,
                        flex: 1,
                        renderCell: params => params.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='error' />
                    },
                    {
                        headerName: 'Imported On',
                        field: 'imported_on',
                        minWidth: 150,
                        flex: 1,
                        renderCell: params => moment(params.value).format('MMM DD, YYYY hh:mm:ss')
                    },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        sortable: false,
                        flex: 1,
                        width: 120,
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
                                        selectedRef.current = params.row.id
                                        setOpen(true)
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
                                        console.log(params.row);
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
                data={data || []}
            />
            <Modal open={open} handleClose={() => setOpen(false)}>
                <ConfirmModal
                    title={
                        <>
                            Delete{' '}
                            <strong style={{ fontSize: 15, paddingInline: 5 }}>Rate Sheets</strong>
                        </>
                    }
                    subtitle='Are you sure you want to continue?'
                    handleClose={() => setOpen(false)}
                    handleSubmit={() => handleDeleteRateSheets(selectedRef.current)}
                />
            </Modal>
        </>
    )

}

export default RateSheetCustomerTable