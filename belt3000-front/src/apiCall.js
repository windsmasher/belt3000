export const apiCall = async (url, options, toast, successMsg, errorMsg, successAction, unauthorizedAction) => {
  try {
    const res = await fetch(url, options);
    if (res.status !== 201 && res.status !== 200 && res.status !== 401) {
      toast({
        title: (await res?.json())?.errorMsg || errorMsg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else if (res.status === 401) {
      unauthorizedAction();
    } else {
      if (successMsg) {
        toast({
          title: successMsg,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      await successAction(res);
    }
  } catch (e) {
    toast({
      title: errorMsg,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};
