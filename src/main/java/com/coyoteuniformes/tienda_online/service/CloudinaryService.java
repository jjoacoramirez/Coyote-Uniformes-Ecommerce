package com.coyoteuniformes.tienda_online.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String subirImagen(MultipartFile archivo) throws IOException {
        @SuppressWarnings("rawtypes")
        Map resultado = cloudinary.uploader().upload(
            archivo.getBytes(),
            ObjectUtils.asMap(
                "folder",        "coyote-uniformes/productos",
                "resource_type", "image"
            )
        );
        return (String) resultado.get("secure_url");
    }

    public void eliminarImagen(String imageUrl) throws IOException {
        String publicId = extraerPublicId(imageUrl);
        if (publicId != null) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extraerPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return null;
        try {
            String sinExtension = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
            String[] partes = sinExtension.split("/upload/");
            if (partes.length < 2) return null;
            String path = partes[1];
            // Remover versión (v1234567890/)
            if (path.startsWith("v") && path.contains("/")) {
                path = path.substring(path.indexOf('/') + 1);
            }
            return path;
        } catch (Exception e) {
            return null;
        }
    }
}
