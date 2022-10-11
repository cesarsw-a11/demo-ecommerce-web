import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import base from '../../../src/assets/illustrations/base.png';
import CardContent from '@mui/material/CardContent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import { useState } from 'react';


export default function MainBanner() {
    /* const [topHeight, setTopHeight] = useState(window.innerWidth);

    window.onresize = function (event) {
        setTopHeight(window.innerWidth - 1000);
    }
    console.log(topHeight) */

    const styles = {
        media: {
            paddingTop: '33%' // 16:9
        },
        card: {
            position: 'relative',
        },
        overlay: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'black',
            backgroundColor: 'white'
        }
    }

    return (
        <>
            <Box sx={{ backgroundColor: '#F0F0F0', mt: 0.5, display: { sm: 'flex', xs: 'none' } }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="3rem">
                <Typography>
                    Free shipping is valid on orders of $100 or more, after promotions and discounts are applied.
                </Typography>

            </Box>
            <Card sx={{position: 'sticky'}} >
                <CardMedia image={base} sx={{ position: 'relative', paddingTop: '33%' }} />
                <CardContent sx={{
                    position: 'absolute', top: 100, bottom: 10, left: 100, fontSize: '5rem', color: 'white',
                    display: { sm: 'block', xs: 'none' }
                }}>
                    <Typography variant="h1" sx={{
                        mb: 2
                    }}>
                        New collection
                    </Typography>
                    <Typography variant="h4"
                        sx={{
                            mb: 4
                        }}>
                        Discover what´s new on the 2022 <br></br>
                        collection
                    </Typography>
                    <Typography variant="h6">
                        <IconButton
                            size="large"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <ArrowForwardIcon />
                        </IconButton>
                        See more
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}