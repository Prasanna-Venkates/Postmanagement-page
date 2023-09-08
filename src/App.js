// src/components/App.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Card,
  CardContent,
  Dialog,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import ApiService from './src/Components/ApiServices';
import LocalStorageService from './src/Components/LocalStorageServices'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  postCard: {
    marginBottom: theme.spacing(2), // Use theme.spacing() as a function
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f5f5f5',
    width: '30%', // Adjust the width to display 3 cards per row
    margin: theme.spacing(2), // Add margin to create space between cards
  },
  postContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteQueue, setDeleteQueue] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Load posts from local storage on initial load
    const savedPosts = LocalStorageService.loadData('posts');
    if (savedPosts) {
      setPosts(savedPosts);
    } else {
      // Fetch posts from the API on the first load
      ApiService.getPosts()
        .then((response) => {
          setPosts(response.data);
          LocalStorageService.saveData('posts', response.data);
        })
        .catch((error) => {
          console.error('Error loading posts:', error);
        });
    }
  }, []);

  // Function to handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to filter posts based on search term
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle post deletion
  const handleDelete = (postId) => {
    // Queue up the delete request
    setDeleteQueue((prevQueue) => [...prevQueue, postId]);
  };

  // Function to clear the delete queue
  const clearDeleteQueue = () => {
    setDeleteQueue([]);
  };

  // Function to handle opening the dialog and fetching comments
  const handleOpenDialog = (postId) => {
    setSelectedPost(postId);
    ApiService.getComments(postId)
      .then((response) => {
        setComments(response.data);
        setOpenDialog(true);
      })
      .catch((error) => {
        console.error('Error loading comments:', error);
      });
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setSelectedPost(null);
    setComments([]);
    setOpenDialog(false);
  };

  // Function to refresh the state
  const refreshState = () => {
    // Clear the local storage data
    LocalStorageService.clearData('posts');
    // Fetch posts from the API
    ApiService.getPosts()
      .then((response) => {
        setPosts(response.data);
        LocalStorageService.saveData('posts', response.data);
        // Clear the delete queue after fetching posts
        clearDeleteQueue();
      })
      .catch((error) => {
        console.error('Error loading posts:', error);
      });
  };

  // Function to process the delete queue
  useEffect(() => {
    const processDeleteQueue = async () => {
      for (const postId of deleteQueue) {
        try {
          await ApiService.deletePost(postId);
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
          LocalStorageService.saveData(
            'posts',
            posts.filter((post) => post.id !== postId)
          );
        } catch (error) {
          console.error(`Error deleting post ${postId}:`, error);
        }
      }
    };

    if (deleteQueue.length > 0) {
      processDeleteQueue();
    }
  }, [deleteQueue, posts]);

  return (
    <div>
      <AppBar position="sticky" color='default'>
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search..."
            onChange={handleSearch}
            value={searchTerm}
          />
          <Button color="inherit" onClick={refreshState}>
            <RefreshIcon />
          </Button>
          <Button
            color="inherit"
            onClick={clearDeleteQueue}
          >
            <ClearIcon />
            Clear Delete Queue
          </Button>
          <Button
            color="inherit"
            onClick={() => setDeleteQueue([...deleteQueue])}
          >
            <DeleteIcon />
            Delete Queue ({deleteQueue.length})
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.postContainer}>
        {filteredPosts.map((post) => (
          <Card key={post.id} className={classes.postCard}>
            <CardContent>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog(post.id)}
                className={classes.button}
              >
                View Comments
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(post.id)}
                
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <ListItemText primary={comment.name} secondary={comment.body} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

export default App;
