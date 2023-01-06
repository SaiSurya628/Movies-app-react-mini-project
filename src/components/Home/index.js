import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Footer from '../Footer'
import HomeMovieDetails from '../HomeMovieDetails'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './index.css'

import Header from '../Header'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
}
const originalDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const trendingDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Home extends Component {
  state = {
    originalList: [],
    trendingList: [],
    randomMovieList: [],
    originalStatus: originalDetails.initial,
    trendingStatus: trendingDetails.initial,
  }

  componentDidMount() {
    this.getOriginalData()
    this.getTrendingData()
  }

  getOriginalData = async () => {
    this.setState({originalStatus: originalDetails.loading})
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const originalApi = 'https://apis.ccbp.in/movies-app/originals'

    const response = await fetch(originalApi, options)
    const data = await response.json()

    if (response.ok === true) {
      const fetchedOriginalsData = data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))

      const randomNumber = Math.floor(
        Math.random() * fetchedOriginalsData.length,
      )
      const randomMovieList = fetchedOriginalsData[randomNumber]

      this.setState({
        originalList: fetchedOriginalsData,
        originalStatus: originalDetails.success,
        randomMovieList,
      })
    } else {
      this.setState({originalStatus: originalDetails.failure})
    }
  }

  getTrendingData = async () => {
    this.setState({trendingStatus: trendingDetails.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const trendingApi = 'https://apis.ccbp.in/movies-app/trending-movies'
    const response = await fetch(trendingApi, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedTrendingData = data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))

      this.setState({
        trendingList: fetchedTrendingData,
        trendingStatus: trendingDetails.success,
      })
    } else {
      this.setState({trendingStatus: trendingDetails.failure})
    }
  }

  retryOriginalData = () => {
    this.getOriginalData()
  }

  retryTrendingData = () => {
    this.getTrendingData()
  }

  onSuccessOriginal = () => {
    const {originalList} = this.state
    return (
      <div className="slick-main">
        <ul className="trending">
          <Slider {...settings}>
            {originalList.map(each => (
              <HomeMovieDetails eachMovie={each} key={each.id} />
            ))}
          </Slider>
        </ul>
      </div>
    )
  }

  onSuccessTrending = () => {
    const {trendingList} = this.state
    return (
      <div>
        <ul className="trending">
          <Slider {...settings} className="slick">
            {trendingList.map(each => (
              <HomeMovieDetails eachMovie={each} key={each.id} />
            ))}
          </Slider>
        </ul>
      </div>
    )
  }

  renderPosterLoadingView = () => (
    <>
      <Header />
      <div className="errorPoster">
        <div className="error-page">
          <div className="loader-container" testid="loader">
            <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
          </div>
        </div>
      </div>
    </>
  )

  onLoadingOriginal = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPosterSuccessView = () => {
    const {randomMovieList} = this.state
    const {title, overview, backdropPath} = randomMovieList

    return (
      <div
        style={{backgroundImage: `url(${backdropPath})`}}
        className="homePoster"
      >
        <Header />
        <div className="posterContainer">
          <h1 className="title">{title}</h1>
          <h1 className="over-view">{overview}</h1>
          <button type="button" className="playButton">
            Play
          </button>
        </div>
      </div>
    )
  }

  renderPosterErrorView = () => (
    <>
      <Header />
      <div className="homePoster">
        <div className="error-page">
          <img
            className="warning-icon"
            alt="failure view"
            src="https://www.shutterstock.com/image-vector/computer-server-big-data-error-600w-2156541851.jpg"
          />
          <p className="final-heading">
            Something went wrong. Please try again
          </p>
          <button
            onClick={this.retryOriginalsMoviesData}
            className="poster-try-again-btn"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    </>
  )

  onFailureOriginal = () => (
    <div className="failure-view">
      <img
        alt="failure view"
        src="https://www.shutterstock.com/image-vector/computer-server-big-data-error-600w-2156541851.jpg"
        className="image"
      />
      <p>Something went wrong. Please try again later</p>
      <br />
      <button className="button" type="button" onClick={this.retryOriginalData}>
        Try Again
      </button>
    </div>
  )

  onFailureTrending = () => (
    <div className="failure-view">
      <img
        src="https://www.shutterstock.com/image-vector/computer-server-big-data-error-600w-2156541851.jpg"
        alt="failure view"
        className="image"
      />
      <p>Something went wrong. Please try again later</p>
      <br />
      <button type="button" onClick={this.retryTrendingData}>
        Try Again
      </button>
    </div>
  )

  renderOriginalsSwitchViews = () => {
    const {originalStatus} = this.state
    switch (originalStatus) {
      case originalDetails.loading:
        return this.onLoadingOriginal()
      case originalDetails.success:
        return this.onSuccessOriginal()
      case originalDetails.failure:
        return this.onFailureOriginal()
      default:
        return null
    }
  }

  renderTrendingSwitchViews = () => {
    const {trendingStatus} = this.state
    switch (trendingStatus) {
      case trendingDetails.loading:
        return this.onLoadingOriginal()
      case trendingDetails.success:
        return this.onSuccessTrending()
      case trendingDetails.failure:
        return this.onFailureTrending()
      default:
        return null
    }
  }

  renderPosterSwitchViews = () => {
    const {originalStatus} = this.state
    switch (originalStatus) {
      case originalDetails.loading:
        return this.renderPosterLoadingView()
      case originalDetails.success:
        return this.renderPosterSuccessView()
      case originalDetails.failure:
        return this.renderPosterErrorView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="originalContainer">
        {this.renderPosterSwitchViews()}
        <h1 className="final-head">Trending Now</h1>
        {this.renderTrendingSwitchViews()}
        <h1 className="final-head">Originals</h1>
        {this.renderOriginalsSwitchViews()}
        <Footer />
      </div>
    )
  }
}
export default Home
