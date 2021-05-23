import React, { useEffect, useState } from 'react'
import './App.css';
import Products from './Components/Products/Products';
import axios from 'axios'
// import Razorpay from 'razorpay'

function App() {

	useEffect(()=>{
        getProducts()
    },[])

    const [Product, setProduct] = useState('')

	const [payment, setpayment] = useState(false)
	const [razorpay_payment_id, setrazorpay_payment_id]  = useState('')
	const [razorpay_order_id, setrazorpay_order_id] = useState('')
	const [razorpay_signature, setrazorpay_signature] = useState('')
	

    const baseUrl = "http://localhost:8000"
    
    const getProducts = async () => {
        const res = await axios.get(`${baseUrl}/products`)
		// console.log(res.data)
        if(res.status==200)
		{
			setProduct(res.data)
		}
        
    }
	const buyNow = async (productId) => {
		const res = await axios.get(`${baseUrl}/order/${productId}`)

		console.log(res.data)

		if(res.status != 200)
		{
			return
		}

		const options = {
			"key": "rzp_test_oBVq8Hma43gE1u", // Enter the Key ID generated from the Dashboard
			"amount": res.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			"currency": res.data.currency,
			"name": "Test",
			"description": res.data.notes.desc,
			"image": "https://example.com/your_logo",
			"order_id": res.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
			"handler": function (response){
				setrazorpay_payment_id(response.razorpay_payment_id);
				setrazorpay_order_id(response.razorpay_order_id);
				setrazorpay_signature(response.razorpay_signature)
				setpayment(true)
			},
			"prefill": {
				"name": "LoggedInUser name",
				"email": "LoggedInUser@example.com",
				"contact": "8667470211"
			},
			// "notes": {
			// 	"address": "Razorpay Corporate Office"
			// },
			// "theme": {
			// 	"color": "#3399cc"
			// }
		};
		const  rzp1 = new window.Razorpay(options);

		rzp1.open()

		rzp1.on('payment.failed', function (response){
				alert(response.error.code);
				alert(response.error.description);
				alert(response.error.source);
				alert(response.error.step);
				alert(response.error.reason);
				alert(response.error.metadata.order_id);
				alert(response.error.metadata.payment_id);
		});
	}

  return (
    <div className="App">
		<div>
			<h4>Prasad</h4>
			{
				payment ? (
					<div>
						<p>PaymentID: {razorpay_payment_id}</p>
						<p>OrderId : {razorpay_order_id}</p>
						<p>RazorPay Signature : {razorpay_signature}</p>
					</div>
				)
				:
				null
			}

		</div>
		<div>
			<Products 
				ProductDetails={Product}
				buyNowBtn = {buyNow}	
			/>
		</div>
    </div>
  );
}
export default App;
