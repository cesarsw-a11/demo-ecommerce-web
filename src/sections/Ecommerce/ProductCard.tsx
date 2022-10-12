import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

//product images
interface Props {
    productName: string;
    id : number;
}

export default function ProductCard(props: Props) {
    const { productName, id } = props;
    const navigate = useNavigate();

    const handleSubmit = (id: any) => {
        navigate('/product_detail',{state:{id: `${id}`}});
    }

    return (
        <Card>
            <ButtonBase sx={{ display: 'block' }} onClick={() => handleSubmit(id)}>
                <img src={require(`../../../src/assets/illustrations/products/${productName}.png`)} />
            </ButtonBase>
            <Typography variant='subtitle1' sx={{ color: 'black' }}>
                Blue dress
                <IconButton sx={{ml: '60%'}}>
                    <FavoriteBorderIcon />
                </IconButton>
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'black', fontWeight: 100 }}>
                Fall collection
            </Typography>
            <Typography variant='subtitle1' sx={{ color: 'black' }}>
                $54.69
            </Typography>
        </Card>
    )

}