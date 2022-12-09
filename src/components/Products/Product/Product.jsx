// import React from 'react'
// import {Card, CardMedia, CardContent, CardActions, Typography, IconButton} from '@material-ui/core';
// import {AddShoppingCart } from '@material-ui/icons';
// import useStyles from './styles'

// const Product = ({ product, onAddToCart }) => {
//     const classes = useStyles();

//   return (
//     <Card className={classes.root}>
//         <CardMedia className={classes.media} image={product.image.url}  title={product.name}/> 
//         <CardContent>
//             <div className={classes.cardContent}>
//                 <Typography variant="h5" gutterBottom>
//                     {product.name}
//                 </Typography>
//                 <Typography variant="h5" gutterBottom>
//                     {product.price.formatted_with_symbol}
//                 </Typography>
//             </div> 
//              <Typography dangerouslySetInnerHTML= {{__html: product.description}} variant='body2' color="textSecondary" />
//             <CardActions disableSpacing className={classes.cardActions}>
//                 <IconButton aria-label="Add to cart" onClick={()=> onAddToCart(product.id, 1)}> 
//                     <AddShoppingCart />
//                 </IconButton>   
//             </CardActions> 
//         </CardContent>
//     </Card>
//   )
// }
 
// export default Product


import React, { useEffect, useState} from 'react'
import {Card, CardMedia, CardContent, CardActions, Typography, IconButton} from '@material-ui/core';
import {AddShoppingCart } from '@material-ui/icons';
import useStyles from './styles';
import {FaRegHeart, FaHeart} from "react-icons/fa";
import { IconContext } from 'react-icons';

const hoverStyles = {
    transform: 'scale(1.5)',
}


// import '../scss/styles.scss';

const Product = ({ product, onAddToCart }) => {
    const classes = useStyles();
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false, localStorage.getItem('isActive') === 'true');

    useEffect(() => {
        localStorage.setItem('isActive', isActive);
      }, [isActive]);

    const handleMouseOver = () => {
        setIsHovering(true)
      };
    
      const handleMouseOut = () => {
        setIsHovering(false);
        
      }; 
      

    //   const favorited = isActive ? classes.heart : classes.emptyheart;
      const favorited = isActive ? <FaHeart className={classes.filledheart} onClick={() =>
        (setIsActive(!isActive))}/>  : 
        <FaRegHeart className={classes.emptyheart} onClick={() => {return (setIsActive(!isActive))}}/>;

  return (
    <Card className={classes.root} onMouseEnter={handleMouseOver} onMouseLeave={ isActive ? handleMouseOver : handleMouseOut}>
        <IconContext.Provider value={{ size:"1.7em"}} >
            <CardMedia className={isHovering ? classes.hover : classes.media} image={product.image.url}  title={product.name}/>
            {isHovering && favorited}
            <CardContent>
                <div className={classes.cardContent}>
                    <Typography variant="h5" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        {product.price.formatted_with_symbol}
                    </Typography>
                </div> 
                <Typography dangerouslySetInnerHTML= {{__html: product.description}} variant='body2' color="textSecondary" />
                <CardActions disableSpacing className={classes.cardActions}>
                    <IconButton aria-label="Add to cart" onClick={()=> onAddToCart(product.id, 1)}> 
                        <AddShoppingCart />
                    </IconButton>   
                </CardActions> 
            </CardContent>
        </IconContext.Provider>
    </Card>
  )
}
 
export default Product;