/**
 * Copyright © 2016-2021 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.thingsboard.server.dao.timeseries;

import com.google.common.util.concurrent.ListenableFuture;
import org.thingsboard.server.common.data.id.DeviceProfileId;
import org.thingsboard.server.common.data.id.EntityId;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.kv.DeleteTsKvQuery;
import org.thingsboard.server.common.data.kv.ReadTsKvQuery;
import org.thingsboard.server.common.data.kv.TsKvEntry;

import java.util.Collection;
import java.util.List;

/**
 * @author Andrew Shvayka
 */
public interface TimeseriesService {

    ListenableFuture<List<TsKvEntry>> findAll(TenantId tenantId, EntityId entityId, List<ReadTsKvQuery> queries);

    ListenableFuture<List<TsKvEntry>> findLatest(TenantId tenantId, EntityId entityId, Collection<String> keys);

    ListenableFuture<List<TsKvEntry>> findAllLatest(TenantId tenantId, EntityId entityId);

    ListenableFuture<Integer> save(TenantId tenantId, EntityId entityId, TsKvEntry tsKvEntry);

    ListenableFuture<Integer> save(TenantId tenantId, EntityId entityId, List<TsKvEntry> tsKvEntry, long ttl);

    ListenableFuture<Integer> saveWithoutLatest(TenantId tenantId, EntityId entityId, List<TsKvEntry> tsKvEntry, long ttl);

    ListenableFuture<List<Void>> saveLatest(TenantId tenantId, EntityId entityId, List<TsKvEntry> tsKvEntry);

    ListenableFuture<List<Void>> remove(TenantId tenantId, EntityId entityId, List<DeleteTsKvQuery> queries);

    ListenableFuture<List<Void>> removeLatest(TenantId tenantId, EntityId entityId, Collection<String> keys);

    ListenableFuture<Collection<String>> removeAllLatest(TenantId tenantId, EntityId entityId);

    List<String> findAllKeysByDeviceProfileId(TenantId tenantId, DeviceProfileId deviceProfileId);

    List<String> findAllKeysByEntityIds(TenantId tenantId, List<EntityId> entityIds);

    void cleanup(long systemTtl);
}
