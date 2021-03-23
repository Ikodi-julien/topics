export const quill = {

  newQuill: null,

  toolbarOptions: {
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
    handlers: {
      'emoji': function() {}
    }
  },

  /**
   * Create a Quill form if one is available
   */
  makeForm: () => {

    // for topics and messages pages only
    if (document.querySelectorAll('#editor').length) {
      quill.newQuill = new Quill('#editor', {
        modules: {
          "toolbar": quill.toolbarOptions,
          "emoji-toolbar": true,
          "emoji-textarea": true,
          "emoji-shortname": true,
        },
        placeholder: 'Kessessé ?...',
        theme: 'snow'
      });
    }
  },
}
