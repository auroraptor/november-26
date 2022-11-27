const emojis = ['✅', '✊', '✨', '⭐', '💯', '🌐', '🦄', '🌟', '🍀', '🔥', '🏆', '🚀', '🌙'];

module.exports = () => emojis[Math.floor(Math.random() * emojis.length)];
