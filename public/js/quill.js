document.addEventListener('DOMContentLoaded', () => {

  const quill = new Quill('#editor', {
    modules: {
      toolbar: [
      ['bold', 'italic'],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
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
