import axios from 'axios'
import moment from 'moment'
import RNFetchBlob from 'rn-fetch-blob'


export const postRequest = async ({ url = null, data = null, header = 'json' }) => {
    try {
        const response = await axios({
            method: 'post',
            url: url,
            headers: {
                'Content-Type': header == 'json' ? 'application/json' : 'multipart/form-data'
            },
            data: data
        })

        if (response.data) {
            return response.data
        }
        return null

    } catch (e) {
        console.log(e)
        return null
    }
}

export const getRequest = async ({ url = null, data = null }) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.data) {
            return response.data
        }
        return null

    } catch (e) {
        console.log(e)
        return null
    }
}

export const blobRequest = async ({ url = null, data = null }) => {
    try { 
        const response = await RNFetchBlob.fetch(
            'POST',
            url,
            {
                'Content-Type': 'multipart/form-data',
            },
            data
        )

        return JSON.parse(response.data)

    } catch (e) {
        console.log(e)
        return null
    }
}

