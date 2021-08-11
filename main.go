package main

import (
	"encoding/base64"
	"io"
	"log"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/test", func(rw http.ResponseWriter, r *http.Request) {
		log.Println("test")
		rw.Header().Add("Access-Control-Allow-Origin", "*")
		f, err := os.OpenFile("test.pdf", os.O_APPEND|os.O_CREATE, os.ModeAppend)
		if err != nil {
			log.Println(err)
			rw.WriteHeader(500)
		}
		defer f.Close()
		_, err = io.Copy(f, base64.NewDecoder(base64.StdEncoding, r.Body))
		// _, err = io.Copy(os.Stdout, r.Body)
		if err != nil {
			log.Println(err)
			rw.WriteHeader(500)
		}
		return
	})
	log.Println("started http://localhost:8888")
	http.ListenAndServe(":8888", nil)
}
