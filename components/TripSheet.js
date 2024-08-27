'use client'

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TripSheet = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    route: '',
    driverName: '',
    coDriverName: '',
    attenderName: '',
    chartOperatedBy: '',
    tripStartDate: '',
    tripEndDate: '',
    tripStartTime: '',
    tripEndTime: '',
    startingKm: '',
    closingKm: '',
    totalRunningKms: '',
    fastagRecharge: '',
    adBluePurchase: '',
    dieselLtrs: '',
    driverCoDriverAttenderBata: '',
    parkingCharges: '',
    serviceBills: '',
    rtoPoliceCharges: '',
    vehicleCleanedBy: '',
    others: '',
    totalTopayCollections: '',
    totalTbbCollections: '',
    totalExpenses: '',
    totalPaidCollections: '',
    sumOfCollections: '',
    profitLoss: '',
    managerVerification: '',
    accountsCompletion: '',
    finalTallyPL: '',
    managerSignDateTime: ''
  });

  const [parties, setParties] = useState(Array(17).fill({
    name: '',
    totalBoxes: '',
    topay: '',
    paid: '',
    tbb: '',
    remarks: '',
    deliveryTime: ''
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlePartyChange = (index, field, value) => {
    const newParties = [...parties];
    newParties[index] = { ...newParties[index], [field]: value };
    setParties(newParties);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <Button onClick={handlePrint} className="mb-4 print:hidden">Print Trip Sheet</Button>
      <div className="border border-gray-300 p-2 text-xs print:text-[8pt] print:w-[210mm] print:h-[297mm] print:m-0">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td colSpan="4" className="border border-gray-300 p-1">
                <div className="flex justify-between items-center">
                  <img src="/path-to-your-logo.png" alt="Gokotagiri Logo" className="h-8" />
                  <span className="text-lg font-bold text-green-600">GOKOTAGIRI CARGO</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-gray-300 p-1 text-center font-bold">
                TRIP SHEET
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">VEHICLE NUMBER</span>
                <Input className="w-full mt-1" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TRIP START DATE</span>
                <Input className="w-full mt-1" type="date" name="tripStartDate" value={formData.tripStartDate} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TRIP END DATE</span>
                <Input className="w-full mt-1" type="date" name="tripEndDate" value={formData.tripEndDate} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">FASTAG RECHARGE</span>
                <Input className="w-full mt-1" name="fastagRecharge" value={formData.fastagRecharge} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">ROUTE</span>
                <Input className="w-full mt-1" name="route" value={formData.route} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TRIP START TIME</span>
                <Input className="w-full mt-1" type="time" name="tripStartTime" value={formData.tripStartTime} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TRIP END TIME</span>
                <Input className="w-full mt-1" type="time" name="tripEndTime" value={formData.tripEndTime} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">DIESEL LTRS</span>
                <Input className="w-full mt-1" name="dieselLtrs" value={formData.dieselLtrs} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">DRIVER NAME</span>
                <Input className="w-full mt-1" name="driverName" value={formData.driverName} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">STARTING KM</span>
                <Input className="w-full mt-1" name="startingKm" value={formData.startingKm} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">CLOSING KM</span>
                <Input className="w-full mt-1" name="closingKm" value={formData.closingKm} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">PARKING CHARGES</span>
                <Input className="w-full mt-1" name="parkingCharges" value={formData.parkingCharges} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">CO DRIVER NAME</span>
                <Input className="w-full mt-1" name="coDriverName" value={formData.coDriverName} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TOTAL RUNNING KMS</span>
                <Input className="w-full mt-1" name="totalRunningKms" value={formData.totalRunningKms} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">DRIVER / CO DRIVER ATTENDER BATA</span>
                <Input className="w-full mt-1" name="driverCoDriverAttenderBata" value={formData.driverCoDriverAttenderBata} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">RTO / POLICE CHARGES</span>
                <Input className="w-full mt-1" name="rtoPoliceCharges" value={formData.rtoPoliceCharges} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">ATTENDER NAME</span>
                <Input className="w-full mt-1" name="attenderName" value={formData.attenderName} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">ADBLUE PURCHASE</span>
                <Input className="w-full mt-1" name="adBluePurchase" value={formData.adBluePurchase} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">SERVICE BILLS</span>
                <Input className="w-full mt-1" name="serviceBills" value={formData.serviceBills} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">OTHERS</span>
                <Input className="w-full mt-1" name="others" value={formData.others} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">CHART OPERATED BY</span>
                <Input className="w-full mt-1" name="chartOperatedBy" value={formData.chartOperatedBy} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">VEHICLE CLEANED BY</span>
                <Input className="w-full mt-1" name="vehicleCleanedBy" value={formData.vehicleCleanedBy} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1" colSpan="2"></td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-gray-300">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-1">PARTY NAME / ADDRESS</th>
                      <th className="border border-gray-300 p-1">TOTAL BOXES</th>
                      <th className="border border-gray-300 p-1">TOPAY</th>
                      <th className="border border-gray-300 p-1">PAID</th>
                      <th className="border border-gray-300 p-1">TBB</th>
                      <th className="border border-gray-300 p-1">REMARKS</th>
                      <th className="border border-gray-300 p-1">DELIVERY TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parties.map((party, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.name} onChange={(e) => handlePartyChange(index, 'name', e.target.value)} />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.totalBoxes} onChange={(e) => handlePartyChange(index, 'totalBoxes', e.target.value)} />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.topay} onChange={(e) => handlePartyChange(index, 'topay', e.target.value)} />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.paid} onChange={(e) => handlePartyChange(index, 'paid', e.target.value)} />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.tbb} onChange={(e) => handlePartyChange(index, 'tbb', e.target.value)} />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.remarks} onChange={(e) => handlePartyChange(index, 'remarks', e.target.value)} />
                        </td>
                        <td className="border border-gray-300 p-1">
                          <Input className="w-full text-xs" value={party.deliveryTime} onChange={(e) => handlePartyChange(index, 'deliveryTime', e.target.value)} />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="border border-gray-300 p-1 font-bold text-center" colSpan="2">65</td>
                      <td className="border border-gray-300 p-1 font-bold text-center">400</td>
                      <td className="border border-gray-300 p-1 font-bold text-center">1600</td>
                      <td className="border border-gray-300 p-1 font-bold text-center">11150</td>
                      <td className="border border-gray-300 p-1"></td>
                      <td className="border border-gray-300 p-1"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TOTAL TOPAY COLLECTIONS (A)</span>
                <Input className="w-full mt-1" name="totalTopayCollections" value={formData.totalTopayCollections} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TOTAL TBB COLLECTIONS (C)</span>
                <Input className="w-full mt-1" name="totalTbbCollections" value={formData.totalTbbCollections} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TOTAL EXPENSES</span>
                <Input className="w-full mt-1" name="totalExpenses" value={formData.totalExpenses} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">P/L</span>
                <Input className="w-full mt-1" name="profitLoss" value={formData.profitLoss} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">TOTAL PAID COLLECTIONS (B)</span>
                <Input className="w-full mt-1" name="totalPaidCollections" value={formData.totalPaidCollections} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">SUM OF (A) + (B) + (C)</span>
                <Input className="w-full mt-1" name="sumOfCollections" value={formData.sumOfCollections} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1" colSpan="2"></td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">MANAGER VERIFICATION</span>
                <Input className="w-full mt-1" name="managerVerification" value={formData.managerVerification} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">ACCOUNTS COMPLETION WITH NAME</span>
                <Input className="w-full mt-1" name="accountsCompletion" value={formData.accountsCompletion} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">FINAL TALLY P/L</span>
                <Input className="w-full mt-1" name="finalTallyPL" value={formData.finalTallyPL} onChange={handleInputChange} />
              </td>
              <td className="border border-gray-300 p-1">
                <span className="font-bold">CHECKLIST & MANAGER SIGN WITH DATE & TIME</span>
                <Input className="w-full mt-1" name="managerSignDateTime" value={formData.managerSignDateTime} onChange={handleInputChange} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripSheet;