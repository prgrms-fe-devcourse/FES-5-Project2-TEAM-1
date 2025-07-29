
import Swal from "sweetalert2";

/* success */
export const showSuccessAlert = (title:string, text?:string) => {
    return Swal.fire({
        icon:'success',
        title,
        text,
        confirmButtonColor:'#A8D5BA',
        iconColor: '#A8D5BA',
        timer:1300,
        showConfirmButton:false,
        customClass: {
            popup: 'my-swal-popup with-bg',
            confirmButton: 'my-confirm-button',
            icon: 'custom-icon-background',
        },
    });
};


/* error */
export const showErrorAlert = (title:string, text?:string) => {
    return Swal.fire({
        icon:'error',
        title,
        text,
        confirmButtonColor:'#F4A9A8',
        iconColor: '#F4A9A8',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-button',
            icon: 'custom-icon-background',
        },
    });
};


/* info */
export const showInfoAlert = (title:string, text?:string) => {
    return Swal.fire({
        icon:'info',
        title,
        text,
        iconColor: '#7FC8D6',
        confirmButtonColor:'#7FC8D6',
        customClass: {
            popup: 'my-swal-popup',
            confirmButton: 'my-confirm-button',
            icon: 'custom-icon-background',
        },
        didOpen: () => {
            const iconContent = document.querySelector('.swal2-icon.swal2-info .swal2-icon-content');
            if (iconContent instanceof HTMLElement) {
                iconContent.style.color = '#7FC8D6';
            }
        }

    });
};


/* warning */
export const showWarningAlert = (title:string, text?:string) => {
    return Swal.fire({
        icon:'warning',
        title,
        text,
        iconColor:'#b99470',
        confirmButtonColor:'#b99470',
        customClass:{
            popup:'my-swal-popup',
            confirmButton:'my-confirm-button',
            icon:'custom-icon-background',
        },
        didOpen:()=>{
            const iconContent = document.querySelector('.swal2-icon.swal2-warning .swal2-icon-content');
            if(iconContent instanceof HTMLElement){
                iconContent.style.color = '#b99470';
            }
        }
    })
}


/* confirm */
export const showConfirmAlert = (title:string, text?:string) => {
    return Swal.fire({
        icon:'question',
        title,
        text,
        showCancelButton:true,
        confirmButtonText:'확인',
        cancelButtonText:'취소',
        confirmButtonColor:'#A6B37D',
        cancelButtonColor:'#cccccc',
        customClass:{
            popup:'my-swal-popup',
            confirmButton:'my-confirm-button',
            cancelButton:'my-cancel-button',
            icon:'custom-icon-background',
        },
         didOpen: () => {
            const iconContent = document.querySelector('.swal2-icon.swal2-question .swal2-icon-content');
            if (iconContent instanceof HTMLElement) {
            iconContent.style.color = '#A6B37D';
            }
        },
    })
}






