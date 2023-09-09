import React, { useState, useEffect, useRef } from 'react';
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
  const prevSearchQueryRef = useRef('');

  useEffect(() => {
    const fetchItems = async () => {
      if (searchQuery === '') {
        return;
      }

      if (prevSearchQueryRef.current !== searchQuery) {
        clearGallery();
        prevSearchQueryRef.current = searchQuery;
      }
      try {
        setIsSomethingLoading(true);

        const { hits: newGallery, total: totalHits } = await fetchGalleryData();

        if (newGallery.length === 0) {
          handleNoImages();
        } else if (
          totalHits === perPage ||
          (newGallery.length < perPage && newGallery.length > 0)
        ) {
          handleEndOfResults();
        }
        updateGallery(newGallery);

        scrollToTopOfNewResults();
      } catch (error) {
        handleError();
      } finally {
        setIsSomethingLoading(false);
      }
    };
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
