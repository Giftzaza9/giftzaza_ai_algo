module.exports.reorderThumbnail = (mainImage, thumbnails) => {
    const mainImageIndex = thumbnails?.indexOf(mainImage);
    if (mainImageIndex !== -1) thumbnails?.splice(mainImageIndex, 1);
    thumbnails?.unshift(mainImage)
    return thumbnails;
}