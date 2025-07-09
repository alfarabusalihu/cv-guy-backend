let resumeData = null;

module.exports = {
  setResume: (data) => { resumeData = data;},
  getResume: () => resumeData,
//   clearResume: () => {
//     resumeData = null;
//   },
};