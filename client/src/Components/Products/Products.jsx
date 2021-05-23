import React, { useEffect, useState } from 'react'

import './style.css'
/**
* @author
* @function Products
**/

const Products = (props) => {

    const Product =  props.ProductDetails
    
  return(
    <div className="productContainer">
        {/* {JSON.stringify(props.ProductDetails)} */}
            {Product &&
               (Product.map((product, index) => 
                    (
                        <div className="product" key={index}>
                            <h3>{product.name}</h3>
                            <h5>{product.currency} {product.price}</h5>
                            <p>{product.description}</p>
                            <button onClick={()=>props.buyNowBtn(product.id)}>Buy Now</button>
                        </div>
                    )
                ))
            }

    </div>
   )
  }


export default Products