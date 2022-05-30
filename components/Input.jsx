/* Mensagem pro eu do futuro:
Desculpa pelo código complexo, um dia vc vai entender */

import { useState, useRef } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from "next-auth/react";
import { XIcon } from "@heroicons/react/solid";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
} from "@heroicons/react/outline";

function Input() {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const sendPost = async () => {
    if (loading == true) {
      return;
    }
    setLoading(true);

    //manda o post pra db
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    //cria e manda a url da imagem pro db
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }
    //limpa a caixa de input
    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  //mostra e seta a imagem no input
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide 
      ${loading && "opacity-60"}`}
    >
      <img
        src={session.user.image}
        alt=""
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="w-full divide-y divide-gray-700">
        {/* Text Area */}
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent outline-none text-[#d9d9d9] text-lg 
            placeholder-gray-500 tracking-wide w-full min-h-[50px]"
            placeholder="What's happening?"
            rows="2"
          />

          {/* Image */}
          {selectedFile && ( //if selectedFile == true
            <div className="relative">
              <div
                onClick={() => setSelectedFile(null)}
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 
                rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>

        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            {/* Icons */}
            <div className="flex items-center">
              <div
                className="icon"
                onClick={
                  () =>
                    filePickerRef.current.click() /* clica na div e ativa o input */
                }
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                <input
                  type="file"
                  onChange={addImageToPost}
                  ref={filePickerRef}
                  hidden
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              <div className="icon">
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
            </div>

            {/* Tweet Button */}
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 
              font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] 
              disabled:opacity-50 disabled:cursor-default"
              disabled={
                !input.trim() &&
                !selectedFile /*.trim() espaço não conta como caractere*/
              }
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
