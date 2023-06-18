import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
  useSpeechRecognition,
  SpeechRecognition,
} from "react-speech-recognition";

import Header from "@/components/Header";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";

const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.4rem;
`;

const InputWrapper = styled.div`
  position: sticky;
  top: 68px;
  margin: 25px 0;
  padding: 5px 0;
  background-color: #eeeeeeaa;
`;

const VoiceButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  margin-left: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  margin-left: 5px;
  cursor: pointer;
`;

const SpeechRecognitionStatus = styled.p`
  margin-top: 10px;
  color: red;
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  const {
    transcript,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    resetTranscript();
    if (transcript.length > 0) {
      setPhrase(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }

  function handleVoiceInput() {
    setPhrase("");
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }

  function cancelVoiceInput() {
    stopListening();
    setPhrase("");
  }

  return (
    <>
      <Header />
      <Center>
        <InputWrapper>
          <SearchInput
            autoFocus
            value={phrase}
            onChange={(ev) => setPhrase(ev.target.value)}
            placeholder="Search for products..."
          />
          <VoiceButton onClick={handleVoiceInput}>Start Voice Search</VoiceButton>
          <CancelButton onClick={cancelVoiceInput}>Cancel Voice Search</CancelButton>
        </InputWrapper>
        {!browserSupportsSpeechRecognition && (
          <SpeechRecognitionStatus>
            Speech recognition is not supported in this browser.
          </SpeechRecognitionStatus>
        )}
        {!isLoading && phrase !== "" && products.length === 0 && (
          <h2>No products found for query &quot;{phrase}&quot;</h2>
        )}
        {isLoading && <Spinner fullWidth={true} />}
        {!isLoading && products.length > 0 && (
          <ProductsGrid products={products} />
        )}
      </Center>
    </>
  );
}
