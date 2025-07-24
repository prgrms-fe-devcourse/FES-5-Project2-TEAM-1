import { useRef, useState, type ChangeEvent } from 'react';
import E from '../MypageEdit.module.css';

interface Props {
  prevImage: string;
  setPrevImage: (value: string) => void;
  setShowDropdown: (value: boolean) => void;
}

function BackgroundEdit({ prevImage, setPrevImage, setShowDropdown }: Props) {

    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const handleFileUpload = ( ) => {
        // const fileInput = document.getElementById('fileInput') as HTMLInputElement; 
        inputRef.current?.click();
    }

    const handleFileChange = ( e:ChangeEvent<HTMLInputElement>) => {
        const coverFiles = e.currentTarget.files;

        if( coverFiles && coverFiles.length > 0 ) {
            const lastFile = coverFiles[ coverFiles.length -1 ];
            setFile( lastFile );
            setPrevImage( URL.createObjectURL( lastFile ) );
        } else {
            setFile( null );
            setPrevImage(prevImage);
        }

        if( inputRef.current ) {
            inputRef.current.value = '';
        }
    }

    console.log( inputRef );

    const handleFileApply = () => {
        
    }

    const handleDeleteFile = () => {
        // setPrevImage();
    }

    const handleClosePopup = () => {
        setShowDropdown(false);
    }

  return (
    <div ref={popupRef} className={E.backgroundEditContainer}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
            <h1>Cover image</h1>
            <button onClick={handleClosePopup}>X</button>
        </div>
        {
            file 
               ? (<img src={URL.createObjectURL(file)} />)
                : (<img src={prevImage}/>)
        }
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flex: '11'}}>
            <button>Delete</button>
            <input ref={inputRef} type='file' id='fileInput' style={{display: 'none'}} accept='image/*' onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            <button>Apply</button>
        </div>
    </div>
  )
}

export default BackgroundEdit
