import React, { useState } from 'react';
import {
    Typography,
    Grid,
    Divider,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import moment from 'moment/moment';

const BillOfLading = (props) => {

    const [data] = useState(props.data || {});

    return (
        <Box
            id='bill-of-lading-document'
            sx={{
                backgroundColor: '#fff',
                padding: 3,
                border: '1px solid #ddd'
            }}
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Box sx={{ border: '2px solid #000', padding: 2 }}>
                        <Grid container justifyContent='space-between' alignItems='flex-start'>
                            <Grid size={'auto'}>
                                <Grid container spacing={1} direction='column'>
                                    <Grid size={'auto'}>
                                        <img src='/assets/logo-messagers.png' alt='messagers' width='120px' />
                                    </Grid>
                                    <Grid size={'auto'}>
                                        <Typography variant='caption'>{data?.receiver_address}</Typography>
                                    </Grid>
                                    <Grid size={'auto'}>
                                        <Typography variant='caption'>
                                            {data?.receiver_city}, {data?.receiver_province}, {data?.receiver_postal_code}
                                        </Typography>
                                    </Grid>
                                    <Grid size={'auto'}>
                                        <Typography variant='caption'>TEL. {data?.receiver_phone_number}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={'auto'}>
                                <Grid container spacing={1} direction='column' alignItems='flex-end'>
                                    <Grid size={'auto'}>
                                        <Typography variant='h5' fontWeight='bold'>STRAIGHT BILL OF LADING</Typography>
                                    </Grid>
                                    <Grid size={'auto'}>
                                        <Typography variant='body2' fontWeight='bold'>ORDER NUMBER:</Typography>
                                    </Grid>
                                    <Grid size={'auto'}>
                                        <Typography variant='h6'>{data?.order_number}</Typography>
                                    </Grid>
                                    <Grid size={'auto'}>
                                        <Typography variant='body2' fontWeight='bold'>DATE: {moment(data?.create_date).format('YYYY-MM-DD')}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider sx={{ height: 5, background: 'primary' }} />
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 2 }} justifyContent={'space-between'}>
                            <Grid size={'auto'}>
                                <Typography variant='body2' fontWeight='bold'>CLIENT:</Typography>
                                <Typography variant='body2'>{data.customer_number || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={'auto'}>
                                <Typography variant='body2' fontWeight='bold'>REFERENCE:</Typography>
                                <Typography variant='body2'>{data?.references && data.references.length > 0 ? data.references[0] : 'N/A'}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2, height: '100%' }}>
                        <Typography variant='body2' fontWeight='bold' sx={{ backgroundColor: '#e0e0e0', p: 0.5, mb: 1 }}>
                            SHIPPER
                        </Typography>
                        <Typography variant='body2' fontWeight='bold'>{data.shipper_name}</Typography>
                        <Typography variant='body2'>{data.shipper_address}</Typography>
                        <Typography variant='body2'>{data.shipper_city}</Typography>
                        <Typography variant='body2'>{data.shipper_province}</Typography>
                        <Typography variant='body2'>{data.shipper_postal_code}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2, height: '100%' }}>
                        <Typography variant='body2' fontWeight='bold' sx={{ backgroundColor: '#e0e0e0', p: 0.5, mb: 1 }}>
                            RECEIVER:
                        </Typography>
                        <Typography variant='body2' fontWeight='bold'>{data.receiver_name}</Typography>
                        <Typography variant='body2'>{data.receiver_address}</Typography>
                        <Typography variant='body2'>{data.receiver_city}</Typography>
                        <Typography variant='body2'>{data.receiver_province}</Typography>
                        <Typography variant='body2'>{data.receiver_postal_code}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2, minHeight: '100px' }}>
                        <Typography variant='body2' fontWeight='bold' sx={{ backgroundColor: '#e0e0e0', p: 0.5 }}>
                            {data.shipper_special_instructions}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2, minHeight: '100px' }}>
                        <Typography variant='body2' fontWeight='bold' sx={{ backgroundColor: '#e0e0e0', p: 0.5 }}>
                            {data.receiver_special_instructions}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer sx={{ border: '2px solid #000' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                    <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        FREIGHT TYPE
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        DESCRIPTION
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        PIECES
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        ACTUAL WEIGHT
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        CHARGEABLE WEIGHT
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        DIMENSIONS
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.freights && data.freights.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ border: '1px solid #000', fontSize: '0.75rem' }}>
                                            {item.type}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #000', fontSize: '0.75rem' }}>
                                            {item.description}
                                        </TableCell>
                                        <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '0.75rem' }}>
                                            {item.pieces}
                                        </TableCell>
                                        <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '0.75rem' }}>
                                            {item.weight} {item.unit}
                                        </TableCell>
                                        <TableCell align="center" sx={{ border: '1px solid #000', fontSize: '0.75rem' }}>
                                            {item.volume_weight} {item.unit}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #000', fontSize: '0.75rem' }}>
                                            {item.length} X {item.width} X {item.height}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell colSpan={2} sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        TOTALS
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        {data.total_pieces}
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        {data.total_actual_weight}
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                        {data.total_volume_weight}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ border: '2px solid #000', padding: 2 }}>
                        <Typography variant='body2' fontWeight='bold' sx={{ backgroundColor: '#e0e0e0', p: 0.5, mb: 1 }}>
                            ACCESSORIALS
                        </Typography>
                        {data.customer_accessorials.filter(acc => acc.is_included).concat(data.additional_service_charges).map((a) => (
                            <Typography variant='body2'>{a.charge_amount} X {a.charge_name} </Typography>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2 }}>
                        <Typography variant='body2' fontWeight='bold'>PICKUP DATE</Typography>
                        <Typography variant='body2'>{data.pickup_date || 'N/A'}</Typography>
                        <Typography variant='caption' sx={{ mt: 1, display: 'block' }}>
                            TIME IN: {data.pickup_in || '00:00'} TIME OUT: {data.pickup_out || '00:00'}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2 }}>
                        <Typography variant='body2' fontWeight='bold'>DELIVERY DATE</Typography>
                        <Typography variant='body2'>{data.delivery_date || 'N/A'}</Typography>
                        <Typography variant='caption' sx={{ mt: 1, display: 'block' }}>
                            TIME IN: {data.delivery_in || '00:00'} TIME OUT: {data.delivery_out || '00:00'}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2, minHeight: '120px' }}>
                        <Typography variant='caption' fontWeight='bold'>
                            SHIPPED IN GOOD ORDER BY:
                        </Typography>
                        <Box sx={{ borderTop: '2px solid #000', mt: 6, pt: 0.5 }}>
                            <Typography variant='caption'>Signature</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ border: '2px solid #000', padding: 2, minHeight: '120px' }}>
                        <Typography variant='caption' fontWeight='bold'>
                            RECEIVED IN GOOD ORDER BY:
                        </Typography>
                        <Box sx={{ borderTop: '2px solid #000', mt: 6, pt: 0.5 }}>
                            <Typography variant='caption'>Signature</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ borderTop: '2px solid #000', pt: 1 }}>
                        <Typography variant='caption' paragraph>
                            MAXIMUM LIABILITY OF $2.00/LB OR $4.40/KG UNLESS DECLARED VALUE STATES OTHERWISE
                            NOTICE OF CLAIM MUST BE SUBMITTED IN WRITING WITHIN 24 HOURS OF DELIVERY.
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <Divider sx={{ height: 2 }} />
                </Grid>
                <Grid size={12}>
                    <Typography variant='caption' align='right' fontWeight='bold' display='block'>
                        POWERED BY IAM INC
                    </Typography>
                </Grid> */}
            </Grid>
        </Box>
    );
};

export default BillOfLading;