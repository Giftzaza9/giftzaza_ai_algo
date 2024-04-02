import Swal from 'sweetalert2';

export const BaseSwal = Swal.mixin({
  customClass: {
    popup: 'swal-custom',
  },
});

export const getSwalConfirmation = async (): Promise<boolean> => {
  const result = await BaseSwal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: 'rgba(168, 108, 198, 1)',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      popup: 'swal-custom',
    },
  });
  return result.isConfirmed;
};
