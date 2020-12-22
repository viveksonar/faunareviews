import { makeStyles } from '@material-ui/core/styles';
export default makeStyles((useStylesCards)=>({
    root: {
        minWidth: 100,
        maxWidth: 100
      },
      bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
      },
      title: {
        fontSize: 14
      },
      pos: {
        marginBottom: 12
      },
      content:{
        flexGrow: 1,
        align: "center"
      },
      media: {
        height: 70,
        paddingTop: '56.25%', // 16:9
      }
}));