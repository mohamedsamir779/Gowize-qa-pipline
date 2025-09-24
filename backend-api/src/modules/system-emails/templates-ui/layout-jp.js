const { keys } = require('src/common/data');

module.exports = `<html >

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" />
    <!--[if !mso]--><!-- -->
    <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet">
    <!--<![endif]-->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">

    <title>Email from ${keys.clientName}</title>

    <style type="text/css">
    
        /* ----------- responsivity ----------- */

        @media only screen and (max-width: 640px) {
            /*------ top header ------ */
            .main-header {
                font-size: 20px !important;
            }
            .main-section-header {
                font-size: 28px !important;
            }
            .show {
                display: block !important;
            }
            .hide {
                display: none !important;
            }
            .align-center {
                text-align: center !important;
            }
            .no-bg {
                background: none !important;
            }
            /*----- main image -------*/
            .main-image img {
                width: 440px !important;
                height: auto !important;
            }
            /* ====== divider ====== */
            .divider img {
                width: 440px !important;
            }
            /*-------- container --------*/
            .container590 {
                width: 440px !important;
            }
            .container580 {
                width: 400px !important;
            }
            .main-button {
                width: 220px !important;
            }
            /*-------- secions ----------*/
            .section-img img {
                width: 320px !important;
                height: auto !important;
            }
            .team-img img {
                width: 100% !important;
                height: auto !important;
            }
             .padd-50{
                padding: 0px 10px;
            }
        }

        @media only screen and (max-width: 479px) {
            /*------ top header ------ */
            .main-header {
                font-size: 18px !important;
            }
            .main-section-header {
                font-size: 26px !important;
            }
            /* ====== divider ====== */
            .divider img {
                width: 280px !important;
            }
            /*-------- container --------*/
            .container590 {
                width: 450px !important;
            }
            .container590 {
                width: 450px !important;
            }
            .container580 {
                width: 440px !important;
            }
            /*-------- secions ----------*/
            .section-img img {
                width: 280px !important;
                height: auto !important;
            }
             .padd-50{
                padding: 0px 10px;
            }
        }
        .container590 p {
            padding: 0;
            margin: 0;
        }
    </style>
    <!--[if gte mso 9]><style type=”text/css”>
        body {
            font-family: 'Poppins', sans-serif !important;
        }
        </style>
    <![endif]-->
</head>


<body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

    <div class="container">

    </div>

    <!-- pre-header -->
    <table style="display:none!important;">
        <tr>
            <td>
                <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:'Poppins', sans-serif;maxheight:0px;max-width:0px;opacity:0;">
                </div>
            </td>
        </tr>
    </table>
    <!-- pre-header end -->

    <!-- header -->
    <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">

        <tr>
            <td align="center">
                <table border="0" align="center" width="590"  bgcolor="ffffff" cellpadding="0" cellspacing="0" class="">

                    <tr bgcolor="ffffff">
                        <td height="25" style="font-size: 25px; ">&nbsp;</td>
                    </tr>

                    <tr>
                        <td align="">

                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590 padd-50">



                            </a>
                            <tr>
                                <td align="left" style="padding-left: 20px">
                                    <a href="${keys.clientWebsite}" style="display: block; border-style: none !important; border: 0 !important;">
                                        <img alt="Logo" width="100" border="0" style="display: block; width: 100px;" 
                                        src="${keys.clientLogo}" alt="${keys.clientName}" /></a>
                                    </td>
                                    <td align="right" style="padding-right: 20px">
                                        <div style="width: 150px; height: 56px">
                                            <a href="${keys.cpUrl}/login" style="display: inline-flex; border-style: none !important; border: 0 !important; padding:5px; text-decoration: none; color: #244987">
                                              <!--   <img  alt="User" width="45" height="45" border="0" style="display: inline-block; height: 45px; width: 45px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABjCAYAAAASNrcdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADI2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjIyQjIzQUEyRkJFMTFFQjk0RTA5MzhGM0U4RDkzMzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjIyQjIzQUIyRkJFMTFFQjk0RTA5MzhGM0U4RDkzMzkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MjJCMjNBODJGQkUxMUVCOTRFMDkzOEYzRThEOTMzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MjJCMjNBOTJGQkUxMUVCOTRFMDkzOEYzRThEOTMzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph2yw7kAAAR5SURBVHhe7ZyLb+JGEIfHQAg2AfO8JJRwuTu1qtr//99oVbVq2kqXciFJiSEPiTcJUI9Zp1zahlfq31xvPgl51sEGPq93Z9erWJ7nzXq9HinREY/HKWZiJWJUPAgVD0LFg1DxIFQ8CBUPQsWDUPEgVDwIFQ9CxYNQ8SBUPAgVD0LFg1DxIFQ8CBUPQsWDUPEgVDwIFQ9CxYNQ8SBUPAgVD0LFg1DxID6Z1cL3Dw90e3tH3W6fRqNRUGYSiTglk0nK7KWpUMjTTiIR7JcMrxYWL96yLOr2+lSvn9FkOjV7/5lYzKLDg30q+hdAMuKXaadSKXqYTOn9aX2pdGY6ndHFZZOur2/NHrmIFZ9Op8l2HDr55TezZ3Uum1c0GA5NSSYixXObXSqV6OTkV78WL6/pT5nNZtRseqYkE5Hii8Uijcdj8lpts2d9Ot0ePZgOWCLixHO7vru7G4jbluFobCJ5iBPPbTsT87OZbXmBU/xniKzxjG3Pt9uQ3NkxkTzEiU+YARBfAM7hN4WPDc8lEVHiY7HYo2zOTLYVLxlxNT6k0+lulEqG8LHD0ciU5CFKfNi+M/FE3ESbY6dsE8lDlPi9vT0T+bGf3XBauSkp/9hSqWhK8hAl/mm7XDk8MNH6HPrHSm7nRYl/OtJ8++bYROvz7u0bHbmuymAwMNGcdNqhnOua0urwMY5j/+18khAn/mktzeU3EO8fw3M9Q8EzlKLEc+7ued5H8sulkolWp5DLUavVMiWZiBLPcE29ubkxJaL9V+W1sht+L/ep9/f3Zo9MxIln+v3+ozgezX77zddBvApffflOvHRGpHjm7u7ORETVLyqUyWRM6d/h9+wm5U6MLSJWPD+A55of4maXi+cZTW6qPgXEimfa7fZjs8Ed7zKGA9nPWRcRLX4xywnX0TzHZDIxkXxEieeO1HEcKhQKVKlUqFarBXPq9foHP9NZvmSDVxbYtkP5fN7f2qKnDOALmlg2P+7j1zwVnMvi2nvltejsrLH2Q+98zqWjo2ow18N3C/cV/BtXaa6iAL6SLOcPdLLZbCA/pOVLbpxfUPPq44HUJvB5D/Zf0evaUbC8jzOlTqdj/ooDKr5cLj8+2B77HWijcR4s0+stZDIvSdpvwo6Pa5Rzs3D5MPGcb/PaGc5Y3p/+Pl+iF1HHyD+a74KcmwliBBDx/KHVapUuLv+gH3/6GTbK5O9ROdwP+oOo4c+OPKtxXZfqH87ou+9/gA7t+Q5rnF/CFrhGLp7TxVO/aZFC6/qvCbkogeTxkp7+b7OSYRsiF88pnaQR5mcjvtvtmkgGKPHQARSPVHloz+tpeE384kDqpeC7K3wMyI8WJcxeQtLJ5+AvxHMzvA1SLv9ChBfjuYsS1lresmje8qiXX6ga/RzixH8uBJXKxErEqHgQKh6Eigeh4kGoeBAqHoSKB6HiQah4ECoehIoHoeJBqHgQKh6Eigeh4kGoeBAqHoSKB6HiQah4ECoehIoHoeJBqHgQKh6Eigeh4kFY7XZ7JvlfSP0fsSyL/gRtILT/Yutj5gAAAABJRU5ErkJggg==
                                                " alt="" /> -->
                                                <span style="background: #e6e6e6; padding: 12px 20px; width: auto"> ログインする </span>
                                            </div>
                                        </td>
                                    </tr>
                            </table>
                        </td>
                    </tr>

                    <tr bgcolor="ffffff">
                        <td height="25" style="font-size: 25px; ">&nbsp;</td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
    <!-- end header -->

    <!-- footer ====== -->
    <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">



        <tr>
            <td align="center">

                <table border="0" align="center" width="590"  bgcolor="ffffff" cellpadding="0" cellspacing="0" class="padd-50" style="padding: 0 20px">
                    <tr>
                        <td height="25" style="font-size: 25px; ">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
                            class="container590 ">
                                <tr>
                                   <td>
                                        ______CONTENT_______
                                   </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="25" style="font-size: 25px; ">&nbsp;</td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
    <!-- end footer ====== -->



<!-- main section -->
<table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">

    <tr>
        <td align="center" >

            <table border="0" align="center" width="590" bgcolor="ffffff" cellpadding="0" cellspacing="0" class=" ">



                <tr>
                    <td align="center" bgcolor="ffffff" style="padding: 40px 10px">
                        <table border="0" width="380" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
                        class="container590 ">
                        <tr >
                            <td align="center">
                                <table border="0" align="center" cellpadding="0" cellspacing="0" class="container580">
                                    <tr>
                                        <td align="center" style="color: #cccccc; font-size: 16px; font-family: 'Poppins', sans-serif; ">
                                            <!-- section text ======-->

                                            <div style=" font-size: 21px; color: #244987; width: 100%; font-weight: 600">

                                            質問は ？私たちはあなたを助けるためにここにいます。

                                                <table style="padding-top: 20px" border="0" align="center" width="80%" cellpadding="0" cellspacing="0" class="container580">
                                                    <tr>
                                                        <td align="center" style="color: #244987; font-size: 16px; font-family: 'Poppins', sans-serif; ">
                                                            <a href="${keys.clientWebsite}" style="text-decoration: none; font-size: 18px;  color: #244987; font-weight: 400">

                                                                <!-- <svg style="width: 60px"  id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 349.74 316.88"><defs><style>.cls-1{fill:#244987;fill-rule:evenodd;}</style></defs><path class="cls-1" d="M174.87,34.85A123.59,123.59,0,1,1,51.28,158.44,123.59,123.59,0,0,1,174.87,34.85Zm-74.91,80,74.91,61.32,74.91-61.32v-6.41H100v6.41Zm0,86.88,41.75-39.6L100,128v73.78Zm108.37-39.85,41.45,39.31V128l-41.45,33.93Zm34.4,46.56-42.28-40.11-25.58,20.94L149.6,168.58l-42,39.86Z"/></svg> -->
                                                                <img alt="Eメール"  style="width: 60px; height: 55px" height="55" width="60" src="https://exiniti.blob.core.windows.net/public/icons/message.png" />
                                                                <span style="display: block">Eメール</span>
                                                            </a>
                                                        </td>
                                                        <td align="center" style="color: #cccccc; font-size: 16px; font-family: 'Poppins', sans-serif; ">
                                                            <a href="${keys.clientWebsite}" style="text-decoration: none; font-size: 18px;  color: #244987; font-weight: 400">
                                                                <!-- <svg style="width: 60px" id="Layer_2" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 349.74 316.88"><defs><style>.cls-1{fill:#244987;fill-rule:evenodd;}</style></defs><path class="cls-1" d="M174.87,37.76A123.59,123.59,0,1,1,51.28,161.35,123.59,123.59,0,0,1,174.87,37.76Zm66,167.9-31.3-30a5.12,5.12,0,0,0-7.14.08l-14.16,14.16C170.16,179,155.94,165.22,146.35,148l14.17-14.17a5.11,5.11,0,0,0,.07-7.14l-30-31.3a5.1,5.1,0,0,0-7.29-.07l-10.07,10.07c-33.34,33.34,84.3,151,117.65,117.64l10.07-10.07a5.1,5.1,0,0,0-.08-7.28Z"/></svg> -->
                                                                <img  alt="コール"  style="width: 60px; height: 55px" height="55" width="60" src="https://exiniti.blob.core.windows.net/public/icons/phone.png" />
                                                                <span style="display: block">コール</span>
                                                            </a>
                                                        </td>
                                                        <td align="center" style="color: #cccccc; font-size: 16px; font-family: 'Poppins', sans-serif; ">
                                                            <a href="${keys.clientWebsite}" style="text-decoration: none; font-size: 18px;  color: #244987; font-weight: 400">
                                                                <!-- <svg style="width: 60px" id="Layer_3" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 349.74 316.88"><defs><style>.cls-1{fill:#244987;fill-rule:evenodd;}</style></defs><path class="cls-1" d="M175.16,34.85A123.59,123.59,0,1,1,51.57,158.44,123.59,123.59,0,0,1,175.16,34.85ZM122.87,96.52h76a15.89,15.89,0,0,1,15.85,15.85v50.7a15.89,15.89,0,0,1-15.85,15.85H164.66l-31.34,19.65V178.92H122.87A15.89,15.89,0,0,1,107,163.07v-50.7a15.89,15.89,0,0,1,15.85-15.85Zm14.84,33.32a7.88,7.88,0,1,1-7.87,7.88,7.88,7.88,0,0,1,7.87-7.88Zm23.19,0a7.88,7.88,0,1,1-7.88,7.88,7.87,7.87,0,0,1,7.88-7.88Zm23.18,0a7.88,7.88,0,1,1-7.88,7.88,7.87,7.87,0,0,1,7.88-7.88Zm47.52,15.24h-9.22v18a23.5,23.5,0,0,1-23.46,23.45H166.85l-3,1.91v5.75a11.72,11.72,0,0,0,11.69,11.69h25.28l23.12,14.49V205.87h7.71a11.72,11.72,0,0,0,11.69-11.69V156.77a11.72,11.72,0,0,0-11.69-11.69Z"/></svg> -->
                                                                <img  alt="チャット"  style="width: 60px; height: 55px" height="55" width="60" src="https://exiniti.blob.core.windows.net/public/icons/chat.png" />
                                                                <span style="display: block">チャット</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>




        </table>
    </td>
</tr>

</table>

<!-- end section -->

<!-- footer ====== -->
<table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">



    <tr>
        <td align="center">

            <table border="0" align="" width="590" bgcolor="ffffff" cellpadding="0" cellspacing="0" class="padd-50" style="padding:0 20px">
            <tr>
                <td>
                    <table border="0" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"
                    class="container590  ">
                    <tr>
                        <td align="left" style="color: #aaaaaa; font-size: 12px; font-family: 'Poppins', sans-serif; text-align:justify;">
                            <div>

                                <span style="color: #333333;  padding-bottom: 10px; display: block">
                                    ドメイン${keys.clientWebsite}は、モーリシャスの金融サービス委員会（FSC）によって認可・規制された${keys.clientFullName}によって運営されています（ライセンス番号GB19024778）。
                                </span>

                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="color: #aaaaaa; font-size: 12px; font-family: 'Poppins', sans-serif; text-align:justify;">
                            <div>

                                <span style="color: #333333;  padding-bottom: 10px; display: block">
                                    ドメイン${keys.clientWebsite}は、キプロス証券取引委員会によって認可・規制された${keys.clientFullName}によって運営されています |キプロス証券取引委員会（CYSEC）（ライセンス番号340/17）。
                                </span>

                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="color: #aaaaaa; font-size: 12px; font-family: 'Poppins', sans-serif; text-align:justify;">
                            <div>

                                <span style="color: #333333;  padding-bottom: 10px; display: block">
                                    高リスク投資警告: CFDとFX証拠金取引は高いリスクを伴うもので、すべての投資家に適しているわけではない可能性があります。レバレッジが高い場合は、あなたに対して有利に働く場合も、不利に働く場合もあります。FX取引を行なうことを決断する前に、投資目標、経験レベル、リスク許容度を慎重に検討する必要があります。初期投資の一部または全部を失い続ける可能性があるため、失ってはいけないお金を投資すべきではありません。FX取引に関連するすべてのリスクを認識し、疑問がある場合は独立した金融アドバイザーに助言を求めるべきです。


                                </span>

                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="color: #aaaaaa; font-size: 12px; font-family: 'Poppins', sans-serif; ">
                            <div>

                                <span style="color: #333333;  padding-bottom: 30px; display: block">
                                    &copy; 2021 ${keys.clientName}. 無断複写・転載を禁じます。

                                </span>

                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td height="25" style="font-size: 25px; ">&nbsp;</td>
                    </tr>

                </table>

            </td>
        </tr>

    </table>
</td>
</tr>


</table>
<!-- end footer ====== -->

</body>

</html>`;
