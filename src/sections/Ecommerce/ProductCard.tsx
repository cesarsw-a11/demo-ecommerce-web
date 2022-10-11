import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

//product images
interface Props{
    productName: string;
}

export default function ProductCard(props: Props){
    const { productName } = props;

return(
    <Card>
        <img src={require(`../../../src/assets/illustrations/products/${productName}.png`)}/>
        <Typography variant='subtitle1' sx={{color: 'black'}}>
                        Blue dress
        </Typography>
        <Typography variant='subtitle2' sx={{color: 'black', fontWeight: 100}}>
                   Fall collection     
        </Typography>
        <Typography variant='subtitle1' sx={{color: 'black'}}>
                   Fall collection     
        </Typography>
    </Card>
)

}