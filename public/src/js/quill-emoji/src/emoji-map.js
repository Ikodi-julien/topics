import emojiList from "./emoji-list.js";

const emojiMap = {};

emojiList.forEach((emojiListObject) => {
    emojiMap[emojiListObject.name] = emojiListObject;
});

export default emojiMap;