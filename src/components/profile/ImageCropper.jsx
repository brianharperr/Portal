import { Box, Button, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useDispatch } from "react-redux";
import { updateProfilePicture } from "../../redux/features/user.slice";
import { useRef, useState } from "react";
import Resizer from "react-image-file-resizer";
import Compressor from 'compressorjs';

export default function ImageCropper({ small, image, visible, onClose })
{
    const cropperRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
    const handleCrop = () => {
        return new Promise((resolve, reject) => {
          const cropper = cropperRef.current.cropper;
          if (!cropper) {
            reject('Cropper reference not found');
            return;
          }
    
          cropper.getCroppedCanvas().toBlob((blob) => {
            if (!blob) {
              reject('Failed to crop image');
              return;
            }
            resolve(blob);
          });
        });
      };

    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve) => {
          Resizer.imageFileResizer(file, maxWidth, maxHeight, 'JPEG', 80, 0, (resizedImage) => {
            resolve(resizedImage);
          }, 'blob');
        });
    };

    async function handleSave()
    {
        var croppedImage = await handleCrop();
        if(croppedImage){
            setLoading(true);
            const resizedImage = await resizeImage(croppedImage, 150, 150);
            const options = {
                maxWidth: 150,
                maxHeight: 150,
                success: (compressedImage) => {
                    dispatch(updateProfilePicture(compressedImage)).unwrap()
                    .then(() => {
                        onClose();
                    })
                    .finally(() => setLoading(false))
                },
                error: (error) => {
                  console.error('Error compressing image:', error);
                },
              };
              new Compressor(resizedImage, options);
        }
    }
    return (
        <Modal
        size={small}
        onClose={onClose}
        open={visible}
        >
            <ModalDialog
            sx={(theme) => ({
                [theme.breakpoints.only('xs')]: {
                  top: 'unset',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderRadius: 0,
                  transform: 'none',
                  maxWidth: 'unset',
                },
            })}
            >
                <ModalClose/>
                <DialogTitle>Update profile picture</DialogTitle>
                <DialogContent>Position image.</DialogContent>
                <Cropper
                ref={cropperRef}
                className="w-64 h-64 md:w-64 md:h-64 my-[25px] mx-auto"
                dragMode="move"
                initialAspectRatio={1}
                src={image && URL.createObjectURL(image)}
                cropBoxMovable={false}
                cropBoxResizable={false}
                viewMode={2}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                movable
                zoomable
                zoomOnTouch
                zoomOnWheel
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                />
                <Box sx={{ display: 'flex' }}>
                    <Button sx={{ width: '100%'}} loading={loading} onClick={handleSave} color="primary">Save</Button>
                </Box>
            </ModalDialog>
        </Modal>
    )
}