// import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import css from './App.module.css';
import Loader from '../Loader/Loader';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import { fetchGallery, perPage } from 'Api/GalleryApiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { animateScroll as scrollUp } from 'react-scroll';
export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pickedImage, setPickedImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [isSomethingLoading, setIsSomethingLoading] = useState(false);
  // const [perPage, setPerPage] = useState(perPage);
  const prevSearchQueryRef = useRef('');
  ///продовжити звідси
  useEffect(() => {
    async function fetchItems() {
      if (searchQuery === '') {
        return;
      }

      if (prevSearchQueryRef.current !== searchQuery) {
        clearGallery();
        prevSearchQueryRef.current = searchQuery;
      }
      try {
        setIsSomethingLoading(true);

        const { hits, totalHits } = await fetchGalleryData();

        if (hits.length === 0) {
          handleNoImages();
        } else if (hits.length < perPage) {
          handleEndOfResults();
        } else {
          updateGallery(hits, totalHits);
        }

        scrollToTopOfNewResults();
      } catch (error) {
        handleError();
      } finally {
        setIsSomethingLoading(false);
      }
    }
    fetchItems();
  }, [searchQuery, page]);

  const clearGallery = () => {
    setShowLoadMoreBtn(false);
    setGallery([]);
  };

  async function fetchGalleryData() {
    return await fetchGallery(searchQuery, page, perPage);
  }

  function handleNoImages() {
    toast.error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  function handleEndOfResults() {
    toast.info("We're sorry, but you've reached the end of search results.");

    setShowLoadMoreBtn(false);
  }

  function updateGallery(newGallery, totalHits) {
    setGallery(prevGallery => [...prevGallery, ...newGallery]);

    setShowLoadMoreBtn(newGallery.length >= perPage);
  }

  function handleError() {
    toast.error('An error occurred while loading images.');
  }

  function scrollToTopOfNewResults() {
    if (showLoadMoreBtn) {
      scrollUp.scrollMore(540, {
        duration: 700,
        smooth: 'easeOutCirc',
      });
    }
    return;
  }

  const handleSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
  };

  const handleImageClick = (imageUrl, tags) => {
    setPickedImage({ url: imageUrl, alt: tags });
    setShowModal(true);
  };
  const handleLoadMoreBtn = () => {
    setPage(prevPage => prevPage + 1);
  };
  const handleCloseModal = () => {
    setPickedImage({ url: '', alt: '' });
    setShowModal(false);
  };

  return (
    <div className={css.appWrapper}>
      <Searchbar onSubmit={handleSubmit} />
      {gallery.length > 0 && (
        <ImageGallery gallery={gallery} handleImageClick={handleImageClick} />
      )}

      {isSomethingLoading && <Loader />}

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <img src={pickedImage.url} alt={pickedImage.alt} />
        </Modal>
      )}
      {showLoadMoreBtn && !isSomethingLoading && (
        <Button onLoadMoreBtnClick={handleLoadMoreBtn}>Load more</Button>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

// export class App extends Component {
//   state = {
//     searchQuery: '',
//     showModal: false,
//     pickedImage: '',
//     gallery: [],
//     page: 1,
//     showLoadMoreBtn: false,
//     isSomethingLoading: false,
//     perPage: perPage,
//   };
//   async componentDidUpdate(prevProps, prevState) {
//     const { searchQuery, page } = this.state;

//     if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
//       if (prevState.searchQuery !== searchQuery) {
//         this.clearGallery();
//       }
//       try {
//         this.setState({ isSomethingLoading: true });

//         const newGallery = await this.fetchGalleryData();

//         if (newGallery.length === 0) {
//           this.handleNoImages();
//         } else if (newGallery.length < this.state.perPage) {
//           this.handleEndOfResults();
//         } else {
//           this.updateGallery(newGallery);
//         }

//         this.scrollToTopOfNewResults();
//       } catch (error) {
//         this.handleError();
//       }
//     }
//   }
//   clearGallery() {
//     this.setState({ showLoadMoreBtn: false, gallery: [] });
//   }

//   async fetchGalleryData() {
//     const { searchQuery, page, perPage } = this.state;
//     return await fetchGallery(searchQuery, page, perPage);
//   }

//   handleNoImages() {
//     toast.error(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     this.setState({ isSomethingLoading: false });
//   }

//   handleEndOfResults() {
//     toast.info("We're sorry, but you've reached the end of search results.");
//     this.setState({ isSomethingLoading: false, showLoadMoreBtn: false });
//   }

//   updateGallery(newGallery) {
//     this.setState(prevState => ({
//       gallery: [...prevState.gallery, ...newGallery],
//       isSomethingLoading: false,
//       showLoadMoreBtn: newGallery.length >= this.state.perPage,
//     }));
//   }

//   handleError() {
//     toast.error('An error occurred while loading images.');
//     this.setState({ isSomethingLoading: false });
//   }

//   scrollToTopOfNewResults = () => {
//     if (this.state.showLoadMoreBtn) {
//       scrollUp.scrollMore(540, {
//         duration: 700,
//         smooth: 'easeOutCirc',
//       });
//     }
//     return;
//   };

//   handleSubmit = searchQuery => {
//     const { searchQuery: prevSearchQuery } = this.state;
//     if (prevSearchQuery !== searchQuery) {
//       this.setState({
//         searchQuery,
//         page: 1,
//       });
//     }
//   };

//   handleImageClick = (imageUrl, tags) => {
//     this.setState({
//       pickedImage: { url: imageUrl, alt: tags },
//       showModal: true,
//     });
//   };
//   handleLoadMoreBtn = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };
//   handleCloseModal = () => {
//     this.setState({
//       pickedImage: { url: '', alt: '' },
//       showModal: false,
//     });
//   };

//   render() {
//     const {
//       gallery,
//       isSomethingLoading,
//       showModal,
//       pickedImage,
//       showLoadMoreBtn,
//     } = this.state;
//     return (
//       <div className={css.appWrapper}>
//         <Searchbar onSubmit={this.handleSubmit} />
//         {gallery.length > 0 && (
//           <ImageGallery
//             gallery={gallery}
//             handleImageClick={this.handleImageClick}
//           />
//         )}

//         {isSomethingLoading && <Loader />}

//         {showModal && (
//           <Modal onClose={this.handleCloseModal}>
//             <img src={pickedImage.url} alt={pickedImage.alt} />
//           </Modal>
//         )}
//         {showLoadMoreBtn && !isSomethingLoading && (
//           <Button onLoadMoreBtnClick={this.handleLoadMoreBtn}>Load more</Button>
//         )}
//         <ToastContainer autoClose={3000} />
//       </div>
//     );
//   }
// }
