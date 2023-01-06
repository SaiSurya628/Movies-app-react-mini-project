import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {format} from 'date-fns'

import './index.css'
import Header from '../Header'
import Footer from '../Footer'

import SimilarMoviesData from '../SimilarMoviesData'

const movieDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const GenreContainer = props => {
  const {details} = props
  const {name} = details

  return <p className="listing">{name}</p>
}

const AvailableLanguage = props => {
  const {details} = props
  const {englishName} = details
  return <p className="listing">{englishName}</p>
}

class MovieItemDetails extends Component {
  state = {movieList: [], movieStatus: movieDetails.initial}

  componentDidMount() {
    this.getMoviedata()
  }

  getMoviedata = async () => {
    this.setState({movieStatus: movieDetails.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const urlId = `https://apis.ccbp.in/movies-app/movies/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(urlId, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedSimilarMovie = data.movie_details.similar_movies.map(
        each => ({
          backdropPath: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }),
      )

      const updatedLanguage = data.movie_details.spoken_languages.map(each => ({
        id: each.id,
        englishName: each.english_name,
      }))

      const totalUpdatedData = {
        adult: data.movie_details.adult,
        backdropPath: data.movie_details.backdrop_path,
        budget: data.movie_details.budget,
        genres: data.movie_details.genres,
        id: data.movie_details.id,
        overview: data.movie_details.overview,
        posterPath: data.movie_details.poster_path,
        releaseDate: data.movie_details.release_date,
        runtime: data.movie_details.runtime,
        similarMovies: updatedSimilarMovie,
        spokenLanguages: updatedLanguage,
        title: data.movie_details.title,
        voteAverage: data.movie_details.vote_average,
        voteCount: data.movie_details.vote_count,
      }

      this.setState({
        movieList: totalUpdatedData,
        movieStatus: movieDetails.success,
      })
    } else {
      this.setState({movieStatus: movieDetails.failure})
    }
  }

  retryFunction = () => {
    this.getMoviedata()
  }

  onFailureOfData = () => (
    <div>
      <Header />
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

  onLoadingView = () => (
    <div>
      <Header />
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </div>
  )

  onSuccessData = () => {
    const {movieList} = this.state
    const {
      adult,
      backdropPath,
      budget,
      genres,
      id,
      overview,
      posterPath,
      releaseDate,
      runtime,
      similarMovies,
      spokenLanguages,
      title,
      voteAverage,
      voteCount,
    } = movieList
    const firstDate = Math.ceil(runtime / 60)
    const minutes = runtime % 60
    const formatDate = `${firstDate}h ${minutes}m`

    const certificate = adult ? 'A' : 'U/A'

    const formatYear = format(new Date(releaseDate), 'yyyy')
    const formatFullDate = format(new Date(releaseDate), 'do MMMM yyyy')

    return (
      <div>
        <div className="main" style={{backgroundImage: `url(${backdropPath})`}}>
          <Header />
          <div className="movie-card">
            <h1 className="head-id">{title}</h1>
            <div className="unOrder">
              <p className="listing">{formatDate}</p>
              <p className="certificate">{certificate}</p>
              <p className="listing">{formatYear}</p>
            </div>
            <p className="para-overview">{overview}</p>
            <div>
              <button type="button" className="button-id">
                Play
              </button>
            </div>
          </div>
          <div className="generalDetails">
            <div>
              <h1 className="general-head">Genres</h1>
              <ul className="unOrder2">
                {genres.map(each => (
                  <GenreContainer details={each} key={each.id} />
                ))}
              </ul>
            </div>
            <div>
              <h1 className="general-head">Audio Available</h1>
              <ul className="unOrder2">
                {spokenLanguages.map(each => (
                  <AvailableLanguage details={each} key={each.id} />
                ))}{' '}
              </ul>
            </div>
            <div>
              <h1 className="general-head">Rating Count</h1>
              <p className="listing">{voteCount}</p>
              <h1 className="general-head">Rating Average</h1>
              <p className="listing">{voteAverage}</p>
            </div>
            <div>
              <h1 className="general-head">Budget</h1>
              <p className="listing">{budget}</p>
              <h1 className="general-head">Release date</h1>
              <p className="listing">{formatFullDate}</p>
            </div>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="similar-head">More like this</h1>
          <ul className="similar-order">
            {similarMovies.map(each => (
              <SimilarMoviesData details={each} key={each.id} />
            ))}
          </ul>
          <Footer />
        </div>
      </div>
    )
  }

  renderFinalData = () => {
    const {movieStatus} = this.state
    switch (movieStatus) {
      case movieDetails.loading:
        return this.onLoadingView()
      case movieDetails.failure:
        return this.onFailureOfData()
      case movieDetails.success:
        return this.onSuccessData()
      default:
        return null
    }
  }

  render() {
    return this.renderFinalData()
  }
}
export default MovieItemDetails
