import {Component} from 'react'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', submitError: false, errorMessage: ''}

  onUserChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  submitSuccessful = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitFailure = errorMessage => {
    this.setState({submitError: true, errorMessage})
  }

  onSuccess = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const newDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(newDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccessful(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {submitError, errorMessage, username, password} = this.state
    return (
      <div className="mainLogin">
        <div className="naa">
          <img
            alt=" login website logo"
            src="https://res.cloudinary.com/ccbp-tech-surya/image/upload/v1672983527/Group_7399_hxofxg.png"
          />
        </div>
        <div className="bgContainer">
          <form onSubmit={this.onSuccess} className="formContainer">
            <h1 className="head">Sign in</h1>
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.onUserChange}
              placeholder="Enter Name"
              className="input"
            />
            <br />
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <br />
            <input
              placeholder="Enter Password"
              id="password"
              value={password}
              onChange={this.onPasswordChange}
              type="password"
              className="input"
            />
            <br />
            <button type="submit" className="button">
              Login
            </button>
            <br />
            {submitError ? <p className="para">*{errorMessage}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
