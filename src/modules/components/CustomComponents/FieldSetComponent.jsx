import { styled } from '@mui/material/styles'

const PaperStyled = styled('fieldset')(({ theme }) => ({
    boxShadow:
        'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
    paddingInline: theme.spacing(3),
    paddingBlock: theme.spacing(3),
    borderRadius: theme.spacing(1),
    '& .legend': {
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: '#fff',
        paddingInline: 5,
    },
    border: 'none'
}))

export default function FieldSetComponent(props) {

    return (
        <PaperStyled>
            <legend className='legend'>{props.title}</legend>
            <div>
                {props.children}
            </div>
        </PaperStyled>
    )

}
