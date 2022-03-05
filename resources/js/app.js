import asios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')
function updateCart(pizza){
    asios.post('/update-cart', pizza).then(res =>{
             cartCounter.innerText = res.data.totalQty
             new Noty({
                 type:'success',
                 timeout:1000,
                 text: 'item add to cart',
                 progressBar: false,
                 layout: 'centerRight'
             }).show();

    }).catch (err =>{
        new Noty({
            type:'error',
            timeout:1000,
            text: 'something went wrong',
            progressBar: false,
            layout: 'centerRight'
        }).show();

    })

}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
       // add cart page
    //  let pizza = btn.dataset.pizza;
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);

    

     console.log(pizza);


    })
})

// remove alert message

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    }, 2000)
}