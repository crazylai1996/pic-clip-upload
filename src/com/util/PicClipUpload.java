package com.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

public class PicClipUpload extends ActionSupport{
	private File upload;
	private String uploadContentType;
	private String uploadFileName;
	private String savedPath;
	public File getUpload() {
		return upload;
	}
	public void setUpload(File upload) {
		this.upload = upload;
	}
	public String getUploadContentType() {
		return uploadContentType;
	}
	public void setUploadContentType(String uploadContentType) {
		this.uploadContentType = uploadContentType;
	}
	public String getUploadFileName() {
		return uploadFileName;
	}
	public void setUploadFileName(String uploadFileName) {
		this.uploadFileName = uploadFileName;
	}
	public String getSavedPath() {
		return ServletActionContext.getServletContext().getRealPath(savedPath);
	}
	public void setSavedPath(String savedPath) {
		this.savedPath = savedPath;
	}
	public String execute(){
		try{
			InputStream in=new FileInputStream(upload);
			OutputStream out=new FileOutputStream(
					new File(this.getSavedPath(),this.getUploadFileName()+".png"));
			byte[] buff=new byte[1024];
			int len=0;
			while(-1!=(len=in.read(buff))){
				out.write(buff, 0, len);
			}
			in.close();
			out.close();
		}
		catch(Exception r){
			
		}
		return "success";
	}
}
