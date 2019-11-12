import React from 'react'
import {Link} from 'react-router-dom'
import CheckoutPage from './checkout-page'

const HomePage = () => {
  return (
    <div className="homePage">
      <div className="fullPage">
        <Link to="/potions" key="potions">
          <img src="https://media.giphy.com/media/SY8xqBKwUiVtgrnQwJ/giphy.gif" />
        </Link>
        <h3>
          <Link to="/potions" key="potions">
            Enter at Your Own Risk!
          </Link>
        </h3>
        <CheckoutPage />
      </div>
    </div>
  )
}

export default HomePage
