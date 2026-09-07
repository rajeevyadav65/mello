package com.melodia.streaming.service;

import com.melodia.config.StorageProperties;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import org.springframework.stereotype.Service;

import java.io.InputStream;

/**
 * Wraps MinIO/S3 access for audio streaming. Kept behind an interface-shaped
 * service (not a raw client call in the controller) so the storage backend can
 * be swapped, and so the controller never leaks bucket/object details to callers -
 * clients only ever see /api/v1/songs/{id}/stream, never a direct storage URL.
 */
@Service
public class StreamingService {

    private final MinioClient minioClient;
    private final StorageProperties storageProperties;

    public StreamingService(MinioClient minioClient, StorageProperties storageProperties) {
        this.minioClient = minioClient;
        this.storageProperties = storageProperties;
    }

    public long getObjectSize(String objectKey) throws Exception {
        StatObjectResponse stat = minioClient.statObject(
                StatObjectArgs.builder()
                        .bucket(storageProperties.getBucket())
                        .object(objectKey)
                        .build());
        return stat.size();
    }

    public InputStream getObjectRange(String objectKey, long start, long length) throws Exception {
        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(storageProperties.getBucket())
                        .object(objectKey)
                        .offset(start)
                        .length(length)
                        .build());
    }
}
