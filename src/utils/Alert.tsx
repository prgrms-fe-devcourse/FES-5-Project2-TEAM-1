import { useEffect } from 'react';
import S from './Alert.module.css';



interface Props {
    message: string;
    onClose: () => void;
}

function Alert({ message, onClose }: Props) {

    

    useEffect(() => {

    })


    return (
        <div className={S.container}>
            {message}
        </div>
    )
}

export default Alert