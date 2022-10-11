import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';

//product images
interface Props {
    productName: string;
}

export default function ProductCard(props: Props) {
    const { productName } = props;

    return (
        <Card>
            <ButtonBase sx={{ display: 'block' }}>
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