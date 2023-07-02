import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { fetchImages } from 'components/services/fetchImages';

export default class App extends Component {
  state = {
    searchRequest: '',
    images: [],
    galleryPage: 1,
    error: null,
    isLoading: false,
    showModal: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchRequest, galleryPage } = this.state;

    if (
      prevState.searchRequest !== searchRequest ||
      prevState.galleryPage !== galleryPage
    ) {
      this.updateImages();
    }
  }

  updateImages = async () => {
    const { searchRequest, galleryPage } = this.state;

    this.setState({ isLoading: true });

    try {
      const data = await fetchImages(searchRequest, galleryPage);

      if (!data.data.hits.length) {
        return toast.error(
          'There are no images found with that search request'
        );
      }

      const mappedImages = data.data.hits.map(
        ({ id, webformatURL, tags, largeImageURL }) => ({
          id,
          webformatURL,
          tags,
          largeImageURL,
        })
      );

      this.setState(prevState => ({
        images: [...prevState.images, ...mappedImages],
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = searchRequest => {
    this.setState({
      searchRequest,
      images: [],
      galleryPage: 1,
    });
  };

  loadMore = () => {
    this.setState(prevState => ({
      galleryPage: prevState.galleryPage + 1,
    }));
  };

  showModalImage = id => {
    const image = this.state.images.find(image => image.id === id);

    this.setState({
      showModal: {
        largeImageURL: image.largeImageURL,
        tags: image.tags,
      },
    });
  };

  closeModalImage = () => {
    this.setState({ showModal: null });
  };

  render() {
    const { images, isLoading, error, showModal } = this.state;

    return (
      <>
        <Searchbar onSearch={this.handleSearchSubmit} />
        {error && toast.error(`Whoops, something went wrong: ${error.message}`)}
        {isLoading && <Loader color={'#3f51b5'} size={64} />}
        {images.length > 0 && (
          <>
            <ImageGallery images={images} handlePreview={this.showModalImage} />
            <Button loadMore={this.loadMore} />
          </>
        )}
        {showModal && (
          <Modal
            lgImage={showModal.largeImageURL}
            tags={showModal.tags}
            closeModal={this.closeModalImage}
          />
        )}
        <ToastContainer autoClose={3000} />
      </>
    );
  }
}
