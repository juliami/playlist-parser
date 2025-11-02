import { createUseStyles } from "react-jss";


const useStyles = createUseStyles({

    button: {
        borderRadius: '4px',
        display: 'block',
        width: '100%',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '20px',
        backgroundColor: '#b17ad5',
        borderStyle: 'none',
        height: '5vh',
        transition: 'background-color 0.8s',
        '&:hover': {
            backgroundColor: '#74369c'
        },
        '&:disabled': {
            backgroundColor: 'gray',
            opacity: 0.4,
        }
    },
})



const Button = ({onClick, text, disabled = true}) => {
    const classes = useStyles();
    return (<button className={classes.button} onClick={onClick} disabled={disabled}>{text}</button>
    )
}

export default Button;