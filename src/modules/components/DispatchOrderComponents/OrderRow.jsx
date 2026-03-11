import React from 'react';
import { Typography, Chip, Link, TableRow, TableCell, Divider, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import OrderActionsMenu from './OrderActionMenu';
import moment from 'moment';
import InlineFreightCell from './InlineFreightCell';

const cellSx = {
    py: 0.5,
    px: 1.5,
    borderBottom: '1px solid',
    borderColor: 'divider',
    verticalAlign: 'middle',
};

const getServiceColor = (type) => ({ Direct: 'info', Rush: 'warning', Regular: 'secondary' }[type] || 'default');

const OrderRow = React.memo(({ row, isEven, isToday, isSelected, onRowClick, onAddNote }) => (
    <>
        <TableRow
            onClick={() => onRowClick(row)}
            sx={{
                bgcolor: isSelected ? 'primary.light' : isToday ? 'primary.outlineHover' : isEven ? '#fff' : 'grey.200',
                cursor: 'pointer',
                outline: isSelected ? '2px solid' : 'none',
                outlineColor: isSelected ? 'primary.main' : 'transparent',
                outlineOffset: '-2px',
                transition: 'background-color 0.15s ease',
                maxHeight: 60,
                overflow: 'hidden',
                '&:hover': {
                    bgcolor: isSelected ? 'primary.light' : isToday ? '#ffe0b2' : 'grey.100',
                    filter: isSelected ? 'brightness(0.97)' : 'none',
                }
            }}
        >
            <TableCell sx={{ ...cellSx, minWidth: 180, borderRight: '1px solid #ccc' }}>
                <Link component={RouterLink} to={`/orders/edit/${row.order_id}`}>
                    <Typography fontWeight={700} fontSize={14} lineHeight={1.3}># {row.order_number}</Typography>
                </Link>
                <Typography variant="caption" color="text.secondary" display="block">{row.customer_name}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ maxWidth: 180 }}>{row.reference_numbers}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{moment(row.order_date || new Date()).format('ddd, DD/MM/YYYY')}</Typography>
            </TableCell>

            <TableCell sx={{ ...cellSx, width: 50, maxWidth: 50, borderRight: '1px solid #ccc' }}>
                <Chip
                    label={row.service_type}
                    color={getServiceColor(row.service_type)}
                    size="small"
                    sx={{ fontSize: 12, fontWeight: 600, borderRadius: '6px' }}
                />
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 160, borderRight: '1px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={13} lineHeight={1.3}>{row.shipper_name}</Typography>
                <Typography noWrap variant="caption" color="text.secondary" display="block">{row.shipper_address}</Typography>
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 150, borderRight: '1px solid #ccc' }}>
                <Typography fontSize={13}>{row.shipper_city} | {row.shipper_province} | {row.shipper_postal_code}</Typography>
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 140, maxWidth: 190, borderRight: '1px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={13}>{moment(row.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
                <Typography variant="caption" color="text.secondary">{row.pickup_time_from} - {row.pickup_time_to}</Typography>
                {row.shipper_special_instructions && <>
                    <Divider />
                    <Tooltip title={row.shipper_special_instructions}>
                        <Typography component="p" fontSize="12px" color="text.secondary"
                            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {row.shipper_special_instructions}
                        </Typography>
                    </Tooltip>
                </>}
                {row.shipper_appointment_numbers && <>
                    <Divider />
                    <Tooltip title={row.shipper_appointment_numbers[0]}>
                        <Typography component="p" fontSize="12px" color="text.secondary" noWrap>
                            <strong>Appointment:</strong> {row.shipper_appointment_numbers[0]}
                        </Typography>
                    </Tooltip>
                </>}
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 190, borderRight: '1px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={13} lineHeight={1.3}>{row.receiver_name}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{row.receiver_address}</Typography>
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 200, borderRight: '1px solid #ccc' }}>
                <Typography fontSize={13}>{row.receiver_city} | {row.receiver_province} | {row.receiver_postal_code}</Typography>
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 140, maxWidth: 190, borderRight: '1px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={13}>{moment(row.delivery_date || row.scheduled_date).format('ddd, DD/MM/YYYY')}</Typography>
                <Typography variant="caption" color="text.secondary">{row.delivery_time_from} - {row.delivery_time_to}</Typography>
                {row.receiver_special_instructions && <>
                    <Divider />
                    <Tooltip title={row.receiver_special_instructions}>
                        <Typography component="p" fontSize="12px" color="text.secondary"
                            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {row.receiver_special_instructions}
                        </Typography>
                    </Tooltip>
                </>}
                {row.receiver_appointment_numbers && <>
                    <Divider />
                    <Tooltip title={row.receiver_appointment_numbers[0]}>
                        <Typography component="p" fontSize="12px" color="text.secondary" noWrap>
                            <strong>Appointment:</strong> {row.receiver_appointment_numbers[0]}
                        </Typography>
                    </Tooltip>
                </>}
            </TableCell>

            <TableCell sx={{ ...cellSx, minWidth: 240, maxWidth: 300, borderRight: '1px solid #ccc' }}>
                <InlineFreightCell freights={row.freights} total_pieces={row.total_pieces} total_actual_weight={row.total_actual_weight} />
            </TableCell>

            <TableCell sx={{ ...cellSx, width: 50, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                <OrderActionsMenu
                    onUpdate={() => console.log('Update order:', row.id)}
                    onUpdateTerminal={() => console.log('Update Terminal:', row.id)}
                    onAddNote={() => onAddNote(row)}
                />
            </TableCell>
        </TableRow>
    </>
));

export default OrderRow;