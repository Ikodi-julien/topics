document.addEventListener('DOMContentLoaded', () => {

  const toolbarOptions = {
    container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          // [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          // [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          // [{ 'direction': 'rtl' }],
          // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          // [{ 'font': [] }],
          // [{ 'align': [] }],
          // ['clean'],
          ['emoji'],
          ['link', 'image'] // 'video' possible
        ],
    // handlers: {
    //   'emoji': function() {}
    // }
  }


  const quill = new Quill('#editor', {
    modules: {
      "toolbar": toolbarOptions,
      "emoji-toolbar": true,
      // "emoji-textarea": true,
      "emoji-shortname": true,
    },
    placeholder: 'Kessessé ?...',
    theme: 'snow'
  });


  const topicForm = document.getElementById('form');
  topicForm.onsubmit = async (event) => {

    event.preventDefault();

    // Populate hidden form on submit
    const topicTitle = event.target.querySelector('input[name="topic__title"]').value;
    const content = event.target.querySelector('textarea[name="topic__desc"]');
    const url = event.target.dataset.action;
    content.value = JSON.stringify(quill.getContents());

    console.log("url", url);
    console.log("Submitted", content.value);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: {
          topic__title: topicTitle,
          topic__desc: content.value

        }

      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }


  return false;
})
