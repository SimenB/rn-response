import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ApolloProvider, Mutation } from 'react-apollo';
import { createUploadLink, ReactNativeFile } from 'apollo-upload-client';
import gql from 'graphql-tag';
import { Constants, ImagePicker } from 'expo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const { manifest } = Constants;

const backendEndpoint = `http://${manifest.debuggerHost
  .split(':')
  .shift()
  .concat(':4000')}`;

const client = new ApolloClient({
  link: createUploadLink({
    uri: `${backendEndpoint}/graphql`,
    credentials: 'omit',
  }),
  cache: new InMemoryCache(),
});

const mutation = gql`
  mutation($file: Upload!) {
    uploadFile(file: $file)
  }
`;

export default class App extends React.Component {
  state = { uploaded: false };

  render() {
    const { uploaded } = this.state;

    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Mutation mutation={mutation}>
            {(upload, { called, error }) => (
              <>
                {called &&
                  (error ? (
                    <Text>It failed :(</Text>
                  ) : uploaded ? (
                    <Text>Woo, it worked!</Text>
                  ) : (
                    <Text>Still uploading...</Text>
                  ))}
                <Button
                  title="Upload!"
                  onPress={async () => {
                    const { uri } = await ImagePicker.launchImageLibraryAsync();

                    const file = new ReactNativeFile({
                      uri,
                      name: 'image.jpg',
                      type: 'image/jpeg',
                    });
                    console.log('start upload', file);
                    try {
                      await upload({ variables: { file } });
                      console.log('success!');
                    } catch (e) {
                      console.error('failed', e);
                    }

                    this.setState({ uploaded: true });
                  }}
                />
              </>
            )}
          </Mutation>
        </View>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
