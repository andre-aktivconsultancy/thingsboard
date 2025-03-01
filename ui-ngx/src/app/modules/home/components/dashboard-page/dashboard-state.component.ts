///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, Input, OnInit } from '@angular/core';
import { PageComponent } from '@shared/components/page.component';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { Dashboard } from '@shared/models/dashboard.models';
import { StateObject, StateParams } from '@core/api/widget-api.models';
import { updateEntityParams, WidgetContext } from '../../models/widget-component.models';
import { deepClone, objToBase64 } from '@core/utils';
import { IDashboardComponent } from '@home/models/dashboard-component.models';
import { EntityId } from '@shared/models/id/entity-id';

@Component({
  selector: 'tb-dashboard-state',
  templateUrl: './dashboard-state.component.html',
  styleUrls: []
})
export class DashboardStateComponent extends PageComponent implements OnInit {

  @Input()
  ctx: WidgetContext;

  @Input()
  stateId: string;

  @Input()
  entityParamName: string;

  @Input()
  entityId: EntityId;

  currentState: string;

  dashboard: Dashboard;

  parentDashboard: IDashboardComponent;

  constructor(protected store: Store<AppState>) {
    super(store);
  }

  ngOnInit(): void {
    this.dashboard = deepClone(this.ctx.stateController.dashboardCtrl.dashboardCtx.getDashboard());
    const stateObject: StateObject = {};
    const params = deepClone(this.ctx.stateController.getStateParams());
    updateEntityParams(params, this.entityParamName, this.entityId);
    stateObject.params = params;
    if (this.stateId) {
      stateObject.id = this.stateId;
    }
    this.currentState = objToBase64([stateObject]);
    this.parentDashboard = this.ctx.parentDashboard ?
      this.ctx.parentDashboard : this.ctx.dashboard;
  }
}
