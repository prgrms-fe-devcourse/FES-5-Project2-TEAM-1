import { useState, type ChangeEvent } from 'react';
import E from '../MypageEdit.module.css';

interface Props {
  prevImage: string;
}

function BackgroundEdit({ prevImage }: Props) {

    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(prevImage);

    const handleFileUpload = ( ) => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement; 
        fileInput.click();
    }

    const handleFileChange = ( e:ChangeEvent<HTMLInputElement>) => {
        const coverFiles = e.currentTarget.files;

        if( coverFiles && coverFiles.length > 0 ) {
            setFile( coverFiles[ coverFiles.length -1 ]);
            setImagePreview( URL.createObjectURL( coverFiles[ coverFiles.length -1 ] ) );
        } else {
            setFile( null );
            setImagePreview(prevImage);
        }
    }

    const handleFileApply = () => {
        
    }

    const handleDeleteFile = () => {

    }

  return (
    <div className={E.backgroundEditContainer}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
            <h1>Cover image</h1>
            <button>X</button>
        </div>
        {
            file 
               ? (<img src={URL.createObjectURL(file)} />)
                : (<img src={imagePreview}/>)
        }
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flex: '11'}}>
            <button>Delete</button>
            <input type='file' id='fileInput' style={{display: 'none'}} accept='image/*' onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            <button>Apply</button>
        </div>
    </div>
  )
}

export default BackgroundEdit
