// ...existing code...

const useStyles = makeStyles((theme) => ({
  // ...existing styles...
  formContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  gridContainer: {
    maxWidth: '100%',
    margin: '32px auto',
    [theme.breakpoints.down('sm')]: {
      margin: '16px auto',
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  // ...existing styles...
}));

const SchoolInternalData = () => {
  // ...existing code...

  return (
    <React.Fragment>
      <Navbar schoolName={globalData.data.SCHOOL_NAME} schoolLogo={globalData.data.SCHOOL_LOGO} />
      <main className={`${classes.mainContainer} layout`}>
        <Sidebar visibleItems={['home']} hideProfile={true} showTitle={false} />
        <Paper className="paper">
          <Typography 
            component="h1" 
            variant="h4" 
            align="center"
            className="school-information-title"
          >
            School Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} style={{ marginTop: '24px' }}>
              <Typography 
                variant="h6" 
                className="school-name"
              >
                {globalData.data.SCHOOL_NAME}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '24px' }}>
              <Typography 
                variant="h6" 
                className="school-id"
              >
                School ID: {globalData.data.SCHOOL_ID}
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={3} className={`${classes.formContainer} ${classes.gridContainer}`}>
            {/* ...existing code... */}
          </Grid>
          <div className={classes.buttons}>
            <Button variant="contained" color="primary" className={`${classes.button} urbanist-font`} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Paper>
      </main>
    </React.Fragment>
  );
};

export default SchoolInternalData;
