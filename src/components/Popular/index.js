import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'

import HomeMovieDetails from '../HomeMovieDetails'

import './index.css'

const popularDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {popularList: [], popularStatus: popularDetails.initial}

  componentDidMount() {
    this.getPopularData()
  }

  getPopularData = async () => {
    this.setState({popularStatus: popularDetails.loading})

    const jwtToken = Cookies.get('jwt_token')

    const popularUrl = 'https://apis.ccbp.in/movies-app/popular-movies'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(popularUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      console.log(fetchedData)
      this.setState({
        popularList: fetchedData,
        popularStatus: popularDetails.success,
      })
    } else {
      this.setState({popularStatus: popularDetails.failure})
    }
  }

  onLoadingData = () => (
    <div>
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </div>
  )

  onFailureOfData = () => (
    <div>
      <div className="failureContainer">
        <img
          src="https://www.shutterstock.com/image-vector/computer-server-big-data-error-600w-2156541851.jpg"
          alt="failure view"
          className="failure-image"
        />
        <p className="failurePara">Something went wrong. Please try again</p>
        <button
          type="button"
          onClick={this.retryFunction}
          className="failure-button"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  retryFunction = () => {
    this.getPopularData()
  }

  onSuccessData = () => {
    const {popularList} = this.state

    return (
      <div>
        <div className="popularContainer">
          <ul className="unOrder">
            {popularList.map(each => (
              <HomeMovieDetails eachMovie={each} key={each.id} />
            ))}
          </ul>
          <Footer />
        </div>
      </div>
    )
  }

  renderingData = () => {
    const {popularStatus} = this.state
    switch (popularStatus) {
      case popularDetails.loading:
        return this.onLoadingData()
      case popularDetails.failure:
        return this.onFailureOfData()
      case popularDetails.success:
        return this.onSuccessData()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main">
        <Header />
        {this.renderingData()}
      </div>
    )
  }
}

export default Popular
