export const actions = [
    {
      title: 'Camera',
      type: 'capture',
      options: {
        maxWidth: 300,
        maxHeight: 300,
        // saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.2,
      },
    },
    {
      title: 'Gallary',
      type: 'library',
      options: {
        maxWidth: 1024,
        maxHeight: 1024,
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.2,
      },
    },
  ];