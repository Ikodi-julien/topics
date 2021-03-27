// import Quill from 'quill';
import EmojiBlot from './format-emoji-blot.js';
import ShortNameEmoji from './module-emoji.js';
import ToolbarEmoji from './module-toolbar-emoji.js';
import TextAreaEmoji from './module-textarea-emoji.js';
import './scss/quill-emoji.scss';

export const quillRegister = () => {
  
Quill.register({
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji
  }, true);  
}


export default { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji };